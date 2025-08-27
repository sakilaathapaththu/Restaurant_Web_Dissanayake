const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");

// Helper to compute final price after discount
function computeFinalPrice({ price, discount }) {
  if (!discount?.active) return price;
  if (discount.type === "percent") {
    const pct = Math.min(Math.max(discount.value || 0, 0), 100);
    return Math.max(0, +price - (+price * pct) / 100);
  }
  // amount
  const amt = Math.max(discount.value || 0, 0);
  return Math.max(0, +price - amt);
}

// Normalize portions array
function normalizePortions(portions = []) {
  const cleaned = [];
  const seen = new Set();
  for (const p of portions) {
    if (!p || !p.label) continue;
    const label = String(p.label).trim();
    if (!label || seen.has(label.toLowerCase())) continue;
    const price = Number(p.price);
    if (isNaN(price) || price < 0) continue;
    const discount = {
      active: !!p?.discount?.active,
      type: p?.discount?.type === "amount" ? "amount" : "percent",
      value: Number(p?.discount?.value || 0),
    };
    cleaned.push({ label, price, discount });
    seen.add(label.toLowerCase());
  }
  return cleaned;
}

// Create
// POST /api/menu-items
exports.createMenuItem = async (req, res, next) => {
  try {
    let {
      menuId, categoryId, categoryName,
      name, description, portions, isActive, itemStatus, order
    } = req.body;

    if (!menuId || !categoryId || !name || !Array.isArray(portions) || portions.length === 0) {
      return res.status(400).json({ error: "menuId, categoryId, name, and portions are required" });
    }

    // Ensure unique menuId
    const exists = await MenuItem.findOne({ menuId });
    if (exists) return res.status(400).json({ error: "menuId already exists" });

    // Load category snapshot + validate labels if category has defined portions
    const cat = await Category.findOne({ categoryId });
    if (!cat) return res.status(400).json({ error: "Invalid categoryId" });
    if (!categoryName) categoryName = cat.name;

    const cleanedPortions = normalizePortions(portions);
    if (!cleanedPortions.length) return res.status(400).json({ error: "At least one valid portion is required" });

    // If category has allowed portion labels, ensure subset
    if (Array.isArray(cat.portions) && cat.portions.length) {
      const allowed = new Set(cat.portions.map(p => String(p).toLowerCase()));
      const bad = cleanedPortions.filter(p => !allowed.has(p.label.toLowerCase()));
      if (bad.length) {
        return res.status(400).json({
          error: `Invalid portion labels for this category: ${bad.map(b => b.label).join(", ")}`
        });
      }
    }

    const doc = await MenuItem.create({
      menuId: String(menuId).trim(),
      categoryId: String(categoryId).trim(),
      categoryName: String(categoryName).trim(),
      name: String(name).trim(),
      description,
      portions: cleanedPortions,
      isActive: isActive !== undefined ? !!isActive : true,
      itemStatus: itemStatus || "available",
      order: typeof order === "number" ? order : 0,
    });

    // attach final prices for convenience
    const data = doc.toObject();
    data.portions = data.portions.map(p => ({
      ...p, finalPrice: computeFinalPrice(p)
    }));

    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err?.code === 11000) return res.status(400).json({ error: "menuId already exists" });
    next(err);
  }
};

// List
// GET /api/menu-items?categoryId=CAT001&active=true&q=salad
exports.getMenuItems = async (req, res, next) => {
  try {
    const { categoryId, active, q } = req.query;
    const query = {};
    if (categoryId) query.categoryId = categoryId;
    if (active === "true") query.isActive = true;
    if (active === "false") query.isActive = false;
    if (q) query.$or = [
      { name: new RegExp(q, "i") },
      { menuId: new RegExp(q, "i") },
      { categoryName: new RegExp(q, "i") },
      { "portions.label": new RegExp(q, "i") },
    ];

    const items = await MenuItem.find(query).sort({ isActive: -1, order: 1, name: 1 });

    const data = items.map(i => {
      const obj = i.toObject();
      obj.portions = obj.portions.map(p => ({ ...p, finalPrice: computeFinalPrice(p) }));
      return obj;
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Get single by _id or menuId
// GET /api/menu-items/:id
exports.getMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    let doc = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) doc = await MenuItem.findById(id);
    if (!doc) doc = await MenuItem.findOne({ menuId: id });
    if (!doc) return res.status(404).json({ error: "Menu item not found" });

    const data = doc.toObject();
    data.portions = data.portions.map(p => ({ ...p, finalPrice: computeFinalPrice(p) }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Update (partial)
// PATCH /api/menu-items/:id
exports.updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Disallow changing menuId via this endpoint (keep unique)
    const payload = {};
    const allowed = ["name", "description", "portions", "isActive", "itemStatus", "order", "categoryId", "categoryName"];
    for (const k of allowed) if (req.body[k] !== undefined) payload[k] = req.body[k];

    // If categoryId changed, validate and set categoryName if absent
    if (payload.categoryId) {
      const cat = await Category.findOne({ categoryId: payload.categoryId });
      if (!cat) return res.status(400).json({ error: "Invalid categoryId" });
      if (!payload.categoryName) payload.categoryName = cat.name;

      // If portions present, validate labels against category allowed set
      if (Array.isArray(payload.portions) && cat.portions?.length) {
        const allowedSet = new Set(cat.portions.map(p => String(p).toLowerCase()));
        const cleaned = normalizePortions(payload.portions);
        const bad = cleaned.filter(p => !allowedSet.has(p.label.toLowerCase()));
        if (bad.length) {
          return res.status(400).json({ error: `Invalid portion labels for this category: ${bad.map(b => b.label).join(", ")}` });
        }
        payload.portions = cleaned;
      } else if (Array.isArray(payload.portions)) {
        payload.portions = normalizePortions(payload.portions);
      }
    } else if (Array.isArray(payload.portions)) {
      payload.portions = normalizePortions(payload.portions);
    }

    // Find by _id or menuId
    let doc = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      doc = await MenuItem.findByIdAndUpdate(id, payload, { new: true });
    }
    if (!doc) doc = await MenuItem.findOneAndUpdate({ menuId: id }, payload, { new: true });
    if (!doc) return res.status(404).json({ error: "Menu item not found" });

    const data = doc.toObject();
    data.portions = data.portions.map(p => ({ ...p, finalPrice: computeFinalPrice(p) }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Toggle active (shortcut)
// PATCH /api/menu-items/:id/toggle
exports.toggleMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    let doc = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) doc = await MenuItem.findById(id);
    if (!doc) doc = await MenuItem.findOne({ menuId: id });
    if (!doc) return res.status(404).json({ error: "Menu item not found" });

    doc.isActive = !doc.isActive;
    await doc.save();

    const data = doc.toObject();
    data.portions = data.portions.map(p => ({ ...p, finalPrice: computeFinalPrice(p) }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
