const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["question", "reservation", "event"], required: true },
    channel: { type: String, enum: ["web"], default: "web" },

    // Contact
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, trim: true },
    email:     { type: String, trim: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"] },
    phone:     { type: String, required: true, trim: true },

    // Booking details (optional for question)
    date:   { type: String }, // YYYY-MM-DD
    time:   { type: String }, // HH:mm (24h)
    guests: { type: Number, min: 1 },
    occasion:    { type: String, trim: true },
    budgetRange: { type: String, trim: true },

    message: { type: String, required: true, trim: true, maxlength: 2000 },
    agreeToPolicy: { type: Boolean, default: false },

    // Ops
    status: { type: String, enum: ["new", "seen", "handled"], default: "new" },
    internalNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

InquirySchema.index({ createdAt: -1, type: 1, status: 1 });

module.exports = mongoose.model("Inquiry", InquirySchema);
