require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const connect = require("./database/connection");

async function seed() {
  try {
    await connect();

    const exists = await Admin.findOne({ role: "superadmin" });
    if (exists) {
      console.log("Superadmin already exists:", exists.username);
      return process.exit();
    }

    const hash = await bcrypt.hash("Password123", 10);

    const admin = await Admin.create({
      firstName: "Super",
      lastName: "Admin",
      adminId: "ADM001",
      username: "superadmin",
      email: "superadmin@example.com",
      passwordHash: hash,
      isActive: true,
      role: "superadmin",
      contactNo: "0712345678",
    });

    console.log("✅ Superadmin inserted:", admin.username);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
