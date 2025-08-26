const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.register = async (req, res) => {
  try {
    const {
      firstName, lastName, adminId,
      username, email, password,
      isActive = true, role, contactNo
    } = req.body;

    if (!firstName || !lastName || !adminId || !username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const totalAdmins = await Admin.countDocuments();
    if (totalAdmins > 0) {
      if (!req.admin?.role || req.admin.role !== "superadmin") {
        return res.status(403).json({ error: "Only superadmin can create admins" });
      }
    }

    const exists = await Admin.findOne({ $or: [{ email }, { username }, { adminId }] });
    if (exists) return res.status(409).json({ error: "Email/username/adminId already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      firstName, lastName, adminId, username, email,
      passwordHash, isActive, contactNo,
      role: totalAdmins === 0 ? "superadmin" : (role || "editor"),
    });

    const token = signToken(newAdmin);
    res.status(201).json({
      admin: {
        id: newAdmin._id, firstName, lastName, adminId,
        username, email, isActive, role: newAdmin.role, contactNo
      },
      token
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const admin = await Admin.findOne({
      $or: [
        { email: usernameOrEmail.toLowerCase() },
        { username: usernameOrEmail.toLowerCase() }
      ]
    });

    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    if (!admin.isActive) return res.status(403).json({ error: "Account inactive" });

    const token = signToken(admin);
    res.json({
      admin: {
        id: admin._id, firstName: admin.firstName, lastName: admin.lastName,
        adminId: admin.adminId, username: admin.username, email: admin.email,
        isActive: admin.isActive, role: admin.role, contactNo: admin.contactNo
      },
      token
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-passwordHash");
    if (!admin) return res.status(404).json({ error: "Not found" });
    res.json({ admin });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ["firstName", "lastName", "isActive", "role", "contactNo"];
    const payload = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    }

    const updated = await Admin.findByIdAndUpdate(id, payload, { new: true })
      .select("-passwordHash");
    if (!updated) return res.status(404).json({ error: "Admin not found" });

    res.json({ admin: updated });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
