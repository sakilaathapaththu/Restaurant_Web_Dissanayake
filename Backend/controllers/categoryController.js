const Category = require("../models/Category");

// Create a new category
// POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    let { categoryId, name, portions = [], description, order } = req.body;

    if (!categoryId || !name) {
      return res.status(400).json({ error: "categoryId and name are required" });
    }

    // Case-insensitive name check to avoid duplicates like "Soup" vs "soup"
    const existingByName = await Category.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (existingByName) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    // Clean portions: trim, lowercase duplicates removed
    if (Array.isArray(portions)) {
      portions = [...new Set(portions.map(p => String(p).trim()))].filter(Boolean);
    } else {
      portions = [];
    }

    const cat = await Category.create({
      categoryId: String(categoryId).trim(),
      name: name.trim(),
      portions,
      description,
      order: typeof order === "number" ? order : 0,
    });

    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ error: "categoryId already exists" });
    }
    next(err);
  }
};

// List categories (active by default)
// GET /api/categories?all=true to include inactive
exports.getCategories = async (req, res, next) => {
  try {
    const includeAll = String(req.query.all || "").toLowerCase() === "true";
    const query = includeAll ? {} : { isActive: true };
    const cats = await Category.find(query).sort({ isActive: -1, order: 1, name: 1 });
    res.json({ success: true, data: cats });
  } catch (err) {
    next(err);
  }
};

// Get single category by id (Mongo _id or categoryId)
// GET /api/categories/:id
exports.getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    let cat = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      cat = await Category.findById(id);
    }
    if (!cat) {
      cat = await Category.findOne({ categoryId: id });
    }

    if (!cat) return res.status(404).json({ error: "Category not found" });
    res.json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};

// Update category (name/portions/order/description/isActive)
// PATCH /api/categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = {};
    const updatable = ["name", "portions", "order", "description", "isActive"];

    for (const k of updatable) {
      if (req.body[k] !== undefined) payload[k] = req.body[k];
    }

    if (payload.name) {
      const exists = await Category.findOne({
        _id: { $ne: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined },
        name: new RegExp(`^${payload.name}$`, "i")
      });
      if (exists) return res.status(400).json({ error: "Category name already exists" });
    }

    if (Array.isArray(payload.portions)) {
      payload.portions = [...new Set(payload.portions.map(p => String(p).trim()))].filter(Boolean);
    }

    let cat = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      cat = await Category.findByIdAndUpdate(id, payload, { new: true });
    }
    if (!cat) {
      cat = await Category.findOneAndUpdate({ categoryId: id }, payload, { new: true });
    }

    if (!cat) return res.status(404).json({ error: "Category not found" });
    res.json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};

// Soft delete (deactivate)
// DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let cat = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      cat = await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
    }
    if (!cat) {
      cat = await Category.findOneAndUpdate({ categoryId: id }, { isActive: false }, { new: true });
    }
    if (!cat) return res.status(404).json({ error: "Category not found" });
    res.json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};
