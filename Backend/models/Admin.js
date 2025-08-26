const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  adminId:   { type: String, required: true, unique: true, trim: true },
  username:  { type: String, required: true, unique: true, lowercase: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  isActive:  { type: Boolean, default: true },
  role:      { type: String, enum: ["superadmin", "editor"], required: true },
  contactNo: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
