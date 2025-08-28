// const MenuItem = require("../models/MenuItem");
// const Category = require("../models/Category");

// // Helper to compute final price after discount
// function computeFinalPrice({ price, discount }) {
//   if (!discount?.active) return price;
//   if (discount.type === "percent") {
//     const pct = Math.min(Math.max(discount.value || 0, 0), 100);
//     return Math.max(0, +price - (+price * pct) / 100);
//   }
//   // amount
//   const amt = Math.max(discount.value || 0, 0);
//   return Math.max(0, +price - amt);
// }

// // Normalize portions array
// function normalizePortions(portions = []) {
//   const cleaned = [];
//   const seen = new Set();
//   for (const p of portions) {
//     if (!p || !p.label) continue;
//     const label = String(p.label).trim();
//     if (!label || seen.has(label.toLowerCase())) continue;
//     const price = Number(p.price);
//     if (isNaN(price) || price < 0) continue;
//     const discount = {
//       active: !!p?.discount?.active,
//       type: p?.discount?.type === "amount" ? "amount" : "percent",
//       value: Number(p?.discount?.value || 0),
//     };
//     cleaned.push({ label, price, discount });
//     seen.add(label.toLowerCase());
//   }
//   return cleaned;
// }

// // Create
// // POST /api/menu-items
// exports.createMenuItem = async (req, res, next) => {
//   try {
//     let {
//       menuId, categoryId, categoryName,
//       name, description, portions, isActive, itemStatus, order
//     } = req.body;

//     if (!menuId || !categoryId || !name || !Array.isArray(portions) || portions.length === 0) {
//       return res.status(400).json({ error: "menuId, categoryId, name, and portions are required" });
//     }

//     // Ensure unique menuId
//     const exists = await MenuItem.findOne({ menuId });
//     if (exists) return res.status(400).json({ error: "menuId already exists" });

//     // Load category snapshot + validate labels if category has defined portions
//     const cat = await Category.findOne({ categoryId });
//     if (!cat) return res.status(400).json({ error: "Invalid categoryId" });
//     if (!categoryName) categoryName = cat.name;

//     const cleanedPortions = normalizePortions(portions);
//     if (!cleanedPortions.length) return res.status(400).json({ error: "At least one valid portion is required" });

//     // If category has allowed portion labels, ensure subset
//     if (Array.isArray(cat.portions) && cat.portions.length) {
//       const allowed = new Set(cat.portions.map(p => String(p).toLowerCase()));
//       const bad = cleanedPortions.filter(p => !allowed.has(p.label.toLowerCase()));
//       if (bad.length) {
//         return res.status(400).json({
//           error: `Invalid portion labels for this category: ${bad.map(b => b.label).join(", ")}`
//         });
//       }
//     }

//     const doc = await MenuItem.create({
//       menuId: String(menuId).trim(),
//       categoryId: String(categoryId).trim(),
//       categoryName: String(categoryName).trim(),
//       name: String(name).trim(),
//       description,
//       portions: cleanedPortions,
//       isActive: isActive !== undefined ? !!isActive : true,
//       itemStatus: itemStatus || "available",
//       order: typeof order === "number" ? order : 0,
//     });

//     // attach final prices for convenience
//     const data = doc.toObject();
//     data.portions = data.portions.map(p => ({
//       ...p, finalPrice: computeFinalPrice(p)
//     }));

//     res.status(201).json({ success: true, data });
//   } catch (err) {
//     if (err?.code === 11000) return res.status(400).json({ error: "menuId already exists" });
//     next(err);
//   }
// };

// // List
// // GET /api/menu-items?categoryId=CAT001&active=true&q=salad
// exports.getMenuItems = async (req, res, next) => {
//   try {
//     const { categoryId, active, q } = req.query;
//     const query = {};
//     if (categoryId) query.categoryId = categoryId;
//     if (active === "true") query.isActive = true;
//     if (active === "false") query.isActive = false;
//     if (q) query.$or = [
//       { name: new RegExp(q, "i") },
//       { menuId: new RegExp(q, "i") },
//       { categoryName: new RegExp(q, "i") },
//       { "portions.label": new RegExp(q, "i") },
//     ];

//     const items = await MenuItem.find(query).sort({ isActive: -1, order: 1, name: 1 });

//     const data = items.map(i => {
//       const obj = i.toObject();
//       obj.portions = obj.portions.map(p => ({ ...p, finalPrice: computeFinalPrice(p) }));
//       return obj;
//     });

//     res.json({ success: true, data });
//   } catch (err) {
//     next(err);
//   }
// };

// // Get single by _id or menuId
// // GET /api/menu-items/:id
// exports.getMenuItem = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     let doc = null;
//     if (id.match(/^[0-9a-fA-F]{24}$/)) doc = await MenuItem.findById(id);
//     if (!doc) doc = await MenuItem.findOne({ menuId: id });
//     if (!doc) return res.status(404).json({ error: "Menu item not found" });

//     const data = doc.toObject();
//     data.portions = data.portions.map(p => ({ ...p, finalPrice: computeFinalPrice(p) }));
//     res.json({ success: true, data });
//   } catch (err) {
//     next(err);
//   }
// };

// // Update (partial)
// // PATCH /api/menu-items/:id
// exports.updateMenuItem = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     // Disallow changing menuId via this endpoint (keep unique)
//     const payload = {};
//     const allowed = ["name", "description", "portions", "isActive", "itemStatus", "order", "categoryId", "categoryName"];
//     for (const k of allowed) if (req.body[k] !== undefined) payload[k] = req.body[k];

//     // If categoryId changed, validate and set categoryName if absent
//     if (payload.categoryId) {
//       const cat = await Category.findOne({ categoryId: payload.categoryId });
//       if (!cat) return res.status(400).json({ error: "Invalid categoryId" });
//       if (!payload.categoryName) payload.categoryName = cat.name;

//       // If portions present, validate labels against category allowed set
//       if (Array.isArray(payload.portions) && cat.portions?.length) {
//         const allowedSet = new Set(cat.portions.map(p => String(p).toLowerCase()));
//         const cleaned = normalizePortions(payload.portions);
//         const bad = cleaned.filter(p => !allowedSet.has(p.label.toLowerCase()));
//         if (bad.length) {
//           return res.status(400).json({ error: `Invalid portion labels for this category: ${bad.map(b => b.label).join(", ")}` });
//         }
//         payload.portions = cleaned;
//       } else if (Array.isArray(payload.portions)) {
//         payload.portions = normalizePortions(payload.portions);
//       }
//     } else if (Array.isArray(payload.portions)) {
//       payload.portions = normalizePortions(payload.portions);
//     }

//     // Find by _id or menuId
//     let doc = null;
//     if (id.match(/^[0-9a-fA-F]{24}$/)) {
//       doc = await MenuItem.findByIdAndUpdate(id, payload, { new: true });
//     }
//     if (!doc) doc = await MenuItem.findOneAndUpdate({ menuId: id }, payload, { new: true });
//     if (!doc) return res.status(404).json({ error: "Menu item not found" });

//     const data = doc.toObject();
//     data.portions = data.portions.map(p => ({ ...p, finalPrice: computeFinalPrice(p) }));
//     res.json({ success: true, data });
//   } catch (err) {
//     next(err);
//   }
// };

// // Toggle active (shortcut)
// // PATCH /api/menu-items/:id/toggle
// exports.toggleMenuItem = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     let doc = null;
//     if (id.match(/^[0-9a-fA-F]{24}$/)) doc = await MenuItem.findById(id);
//     if (!doc) doc = await MenuItem.findOne({ menuId: id });
//     if (!doc) return res.status(404).json({ error: "Menu item not found" });

//     doc.isActive = !doc.isActive;
//     await doc.save();

//     const data = doc.toObject();
//     data.portions = data.portions.map(p => ({ ...p, finalPrice: computeFinalPrice(p) }));
//     res.json({ success: true, data });
//   } catch (err) {
//     next(err);
//   }
// };
const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");

// Allowed mimes & size limits
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024; // ~1.5MB

// Helper: final price after discount
function computeFinalPrice({ price, discount }) {
  if (!discount?.active) return price;
  if (discount.type === "percent") {
    const pct = Math.min(Math.max(discount.value || 0, 0), 100);
    return Math.max(0, +price - (+price * pct) / 100);
  }
  const amt = Math.max(discount.value || 0, 0);
  return Math.max(0, +price - amt);
}

// Helper: count bytes of a base64 string (no data prefix)
function bytesFromBase64(b64) {
  // base64 -> bytes = (len * 3/4) - padding
  const len = b64.length;
  const padding = (b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0);
  return Math.floor((len * 3) / 4) - padding;
}

// Helper: parse base64 input (accepts Data URI or raw base64)
function parseBase64Image(input) {
  if (!input || typeof input !== "string") return null;

  let mime = "image/jpeg";
  let b64 = input.trim();

  // If it's a data URI: data:image/png;base64,XXXX
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/i.exec(b64);
  if (m) {
    mime = m[1].toLowerCase();
    b64 = m[2];
  } else {
    // raw base64 → trust provided mime via optional header in body?
    // we'll keep default jpeg unless client sends mime separately
  }

  if (!ALLOWED_MIME.has(mime)) {
    throw new Error("Only JPEG, PNG, WEBP are allowed");
  }

  // basic base64 validation
  if (!/^[0-9a-zA-Z+/]+={0,2}$/.test(b64)) {
    throw new Error("Invalid base64 image data");
  }

  const bytes = bytesFromBase64(b64);
  if (bytes > MAX_IMAGE_BYTES) {
    throw new Error("Image too large (max ~1.5MB)");
  }

  return { mime, data: b64 };
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
      name, description, portions, isActive, itemStatus, order,
      imageBase64, imageMime // optional (imageMime ignored if data URI provided)
    } = req.body;

    if (!menuId || !categoryId || !name || !Array.isArray(portions) || portions.length === 0) {
      return res.status(400).json({ error: "menuId, categoryId, name, and portions are required" });
    }

    // Ensure unique menuId
    const exists = await MenuItem.findOne({ menuId });
    if (exists) return res.status(400).json({ error: "menuId already exists" });

    // Load category + validate portions
    const cat = await Category.findOne({ categoryId });
    if (!cat) return res.status(400).json({ error: "Invalid categoryId" });
    if (!categoryName) categoryName = cat.name;

    const cleanedPortions = normalizePortions(portions);
    if (!cleanedPortions.length) return res.status(400).json({ error: "At least one valid portion is required" });

    if (Array.isArray(cat.portions) && cat.portions.length) {
      const allowed = new Set(cat.portions.map(p => String(p).toLowerCase()));
      const bad = cleanedPortions.filter(p => !allowed.has(p.label.toLowerCase()));
      if (bad.length) {
        return res.status(400).json({
          error: `Invalid portion labels for this category: ${bad.map(b => b.label).join(", ")}`
        });
      }
    }

    // 🔥 Handle optional imageBase64
    let image = {};
    if (imageBase64) {
      const parsed = parseBase64Image(imageBase64);
      image = { mime: parsed.mime, data: parsed.data };
    } else if (imageMime && req.body.imageData) {
      // alternate: imageData + imageMime
      const parsed = parseBase64Image(`data:${imageMime};base64,${req.body.imageData}`);
      image = { mime: parsed.mime, data: parsed.data };
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
      image // may be {}
    });

    const data = doc.toObject();
    data.portions = data.portions.map(p => ({ ...p, finalPrice: computeFinalPrice(p) }));
    // We do NOT include raw base64 image in list responses by default.
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err?.message?.includes("Only JPEG") || err?.message?.includes("base64") || err?.message?.includes("too large")) {
      return res.status(400).json({ error: err.message });
    }
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
      // Do not ship base64 in list to keep payload small
      if (obj.image) {
        obj.hasImage = !!obj.image?.data;
        delete obj.image;
      }
      return obj;
    });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// Get single by _id or menuId
// GET /api/menu-items/:id
//   add ?withImage=true to include data URI inline (careful: heavy)
exports.getMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    let doc = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) doc = await MenuItem.findById(id);
    if (!doc) doc = await MenuItem.findOne({ menuId: id });
    if (!doc) return res.status(404).json({ error: "Menu item not found" });

    const data = doc.toObject();
    data.portions = data.portions.map(p => ({ ...p, finalPrice: computeFinalPrice(p) }));

    if (req.query.withImage === "true" && data?.image?.data && data?.image?.mime) {
      data.imageDataUri = `data:${data.image.mime};base64,${data.image.data}`;
    }
    if (data.image) {
      data.hasImage = !!data.image?.data;
      delete data.image;
    }

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

    const payload = {};
    const allowed = ["name", "description", "portions", "isActive", "itemStatus", "order", "categoryId", "categoryName"];
    for (const k of allowed) if (req.body[k] !== undefined) payload[k] = req.body[k];

    // Optional: imageBase64 (replace image)
    if (req.body.imageBase64) {
      const parsed = parseBase64Image(req.body.imageBase64);
      payload.image = { mime: parsed.mime, data: parsed.data };
    }
    // Optional: removeImage flag
    if (req.body.removeImage === true || req.body.removeImage === "true") {
      payload.image = { mime: null, data: null };
    }

    if (payload.categoryId) {
      const cat = await Category.findOne({ categoryId: payload.categoryId });
      if (!cat) return res.status(400).json({ error: "Invalid categoryId" });
      if (!payload.categoryName) payload.categoryName = cat.name;

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

    let doc = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      doc = await MenuItem.findByIdAndUpdate(id, payload, { new: true });
    }
    if (!doc) doc = await MenuItem.findOneAndUpdate({ menuId: id }, payload, { new: true });
    if (!doc) return res.status(404).json({ error: "Menu item not found" });

    const data = doc.toObject();
    data.portions = data.portions.map(p => ({ ...p, finalPrice: computeFinalPrice(p) }));
    if (data.image) {
      data.hasImage = !!data.image?.data;
      delete data.image;
    }
    res.json({ success: true, data });
  } catch (err) {
    if (err?.message?.includes("Only JPEG") || err?.message?.includes("base64") || err?.message?.includes("too large")) {
      return res.status(400).json({ error: err.message });
    }
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
    if (data.image) {
      data.hasImage = !!data.image?.data;
      delete data.image;
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

/** ---------- NEW: Image endpoints ---------- */

// Upload/replace image via multipart/form-data (field name: "image")
exports.setMenuItemImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) return res.status(400).json({ error: "No image uploaded" });
    const mime = (req.file.mimetype || "").toLowerCase();
    if (!ALLOWED_MIME.has(mime)) return res.status(400).json({ error: "Only JPEG, PNG, WEBP are allowed" });
    if (req.file.size > MAX_IMAGE_BYTES) return res.status(400).json({ error: "Image too large (max ~1.5MB)" });

    const b64 = req.file.buffer.toString("base64");

    let doc = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) doc = await MenuItem.findById(id);
    if (!doc) doc = await MenuItem.findOne({ menuId: id });
    if (!doc) return res.status(404).json({ error: "Menu item not found" });

    doc.image = { mime, data: b64 };
    await doc.save();

    return res.json({ success: true, data: { id: doc._id, hasImage: true } });
  } catch (err) {
    next(err);
  }
};

// Remove image
exports.removeMenuItemImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let doc = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) doc = await MenuItem.findById(id);
    if (!doc) doc = await MenuItem.findOne({ menuId: id });
    if (!doc) return res.status(404).json({ error: "Menu item not found" });

    doc.image = { mime: null, data: null };
    await doc.save();

    return res.json({ success: true, data: { id: doc._id, hasImage: false } });
  } catch (err) {
    next(err);
  }
};

// Serve image as binary (for <img src="/api/menu-items/:id/image">)
exports.getMenuItemImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let doc = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) doc = await MenuItem.findById(id).select("image");
    if (!doc) doc = await MenuItem.findOne({ menuId: id }).select("image");
    if (!doc || !doc.image?.data || !doc.image?.mime) return res.status(404).json({ error: "Image not found" });

    const buf = Buffer.from(doc.image.data, "base64");
    res.set("Content-Type", doc.image.mime);
    // Cache aggressively (optional)
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(buf);
  } catch (err) {
    next(err);
  }
};
