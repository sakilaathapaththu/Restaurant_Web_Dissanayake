const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create new admin (superadmin only)
exports.createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, adminId, username, email, password, role, contactNo } = req.body;

    if (!firstName || !lastName || !adminId || !username || !email || !password || !role) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    const exists = await Admin.findOne({ $or: [{ email }, { username }, { adminId }] });
    if (exists) {
      return res.status(400).json({ error: "Admin with this email/username/adminId already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      firstName,
      lastName,
      adminId,
      username,
      email,
      passwordHash,
      role,
      contactNo
    });

    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// List admins (superadmin only)
exports.getAdmins = async (_req, res, next) => {
  try {
    const admins = await Admin.find().select("-passwordHash");
    res.json({ success: true, data: admins });
  } catch (err) {
    next(err);
  }
};

// Login (email or username)
exports.loginAdmin = async (req, res, next) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "usernameOrEmail and password are required" });
    }

    const id = String(usernameOrEmail).toLowerCase().trim();
    const admin = await Admin.findOne({ $or: [{ email: id }, { username: id }] });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });
    if (!admin.isActive) return res.status(403).json({ error: "Account is disabled" });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { sub: admin._id.toString(), role: admin.role, username: admin.username, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get current admin
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.sub).select("-passwordHash");
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json({ admin });
  } catch (err) {
    next(err);
  }
};
