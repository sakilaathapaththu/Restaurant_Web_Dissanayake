const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true }, // Reference to food item
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedPortion: {
        index: { type: Number, default: 0 },
        label: { type: String, default: "Standard" },
        price: { type: Number }
    },
    totalPrice: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, // User identifier (could be session ID for guest users)
    items: [cartItemSchema],
    totalAmount: { type: Number, default: 0 },
    itemCount: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Update totals before saving
cartSchema.pre('save', function () {
    this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.totalAmount = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.lastUpdated = new Date();
});

module.exports = mongoose.model("Cart", cartSchema);