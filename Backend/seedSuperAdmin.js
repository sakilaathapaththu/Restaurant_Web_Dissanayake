// scripts/seedSuperAdmin.js
require("dotenv").config();
const bcrypt = require("bcryptjs");

// Reuse your app's DB connection + model
const connect = require("./database/connection");
const Admin = require("./models/Admin");

(async () => {
  try {
    await connect();

    // Optional: ensure DB indexes match the schema (won't run every boot in prod)
    await Admin.syncIndexes();

    // If any admin exists already, skip (safety)
    const alreadyHasAdmin = await Admin.exists({});
    if (alreadyHasAdmin) {
      console.log("Admins already exist. Aborting seed.");
      process.exit(0);
    }

    // Read from .env or fall back to safe defaults (CHANGE THESE!)
    const firstName = process.env.SEED_FIRSTNAME || "Super";
    const lastName  = process.env.SEED_LASTNAME  || "Admin";
    const adminId   = process.env.SEED_ADMINID   || "ADM001";
    const username  = (process.env.SEED_USERNAME || "superadmin").toLowerCase();
    const email     = (process.env.SEED_EMAIL    || "superadmin@example.com").toLowerCase();
    const password  = process.env.SEED_PASSWORD  || "ChangeMe!123"; // <- change after login
    const role      = "superadmin";

    const passwordHash = await bcrypt.hash(password, 10);

    const superAdmin = await Admin.create({
      firstName, lastName, adminId, username, email, passwordHash, role, isActive: true
    });

    console.log("✅ Superadmin created:");
    console.table({
      id: superAdmin._id.toString(),
      adminId,
      username,
      email,
      role
    });
    console.log("➡️  Login with the above username/email and the password you set.");
    console.log("⚠️  Remember to change the password after first login.");

    process.exit(0);
  } catch (err) {
    // Friendlier duplicate error
    if (err?.code === 11000) {
      const key = Object.keys(err.keyPattern || err.keyValue || {})[0] || "field";
      console.error(`E11000 duplicate key on ${key}. Clean indexes/documents and retry.`);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
})();
