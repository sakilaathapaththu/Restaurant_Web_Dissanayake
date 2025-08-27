const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryId: { type: String, required: true, unique: true, trim: true }, // e.g., CAT001
    name:       { type: String, required: true, trim: true },               // e.g., "Salad"
    // Allowed portion/size labels. Optional; NO prices here.
    portions:   { type: [String], default: [] },                             // e.g., ["full","normal","1person"]
    isActive:   { type: Boolean, default: true },
    order:      { type: Number, default: 0 },                                // for sorting in UI
    description:{ type: String, trim: true }
  },
  { timestamps: true }
);

// Helpful compound index for listing active categories first + by order
categorySchema.index({ isActive: 1, order: 1 });

// Optional: enforce unique name case-insensitively at query-time via controller;
// we keep a unique index only on categoryId to avoid collation pitfalls.

module.exports = mongoose.model("Category", categorySchema);
