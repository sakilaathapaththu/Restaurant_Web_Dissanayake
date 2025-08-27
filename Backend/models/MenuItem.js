const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    active: { type: Boolean, default: false },
    type: { type: String, enum: ["percent", "amount"], default: "percent" },
    value: { type: Number, default: 0 }, // percent 0-100, or fixed amount
  },
  { _id: false }
);

const PortionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true }, // e.g., full, normal, 1person
    price: { type: Number, required: true, min: 0 },
    discount: { type: DiscountSchema, default: () => ({}) },
  },
  { _id: false }
);

const MenuItemSchema = new mongoose.Schema(
  {
    menuId: { type: String, required: true, unique: true, trim: true }, // ITEM001
    categoryId: { type: String, required: true, trim: true },           // CAT001
    categoryName: { type: String, trim: true },                          // snapshot ("Salad")
    name: { type: String, required: true, trim: true },                  // "Greek Salad"
    description: { type: String, trim: true },
    portions: { type: [PortionSchema], validate: v => Array.isArray(v) && v.length > 0 },
    isActive: { type: Boolean, default: true },                          // enable/disable item
    itemStatus: {
      type: String,
      enum: ["available", "out_of_stock", "unavailable"],
      default: "available",
    },
    order: { type: Number, default: 0 },                                 // optional for sorting
  },
  { timestamps: true }
);

// Optional uniqueness of name inside the same category (case-insensitive via controller checks)
// MenuItemSchema.index({ categoryId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("MenuItem", MenuItemSchema);
