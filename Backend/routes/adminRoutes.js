const express = require("express");
const { createAdmin, getAdmins, loginAdmin, getMe } = require("../controllers/adminController");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

const router = express.Router();

/**
 * Public
 */
router.post("/login", loginAdmin);

/**
 * Protected (superadmin only for listing & creating admins)
 */
router.post("/", auth, requireRole("superadmin"), createAdmin); // POST /api/admins
router.get("/", auth, requireRole("superadmin"), getAdmins);    // GET  /api/admins

/**
 * Protected (any logged-in admin)
 */
router.get("/me", auth, getMe);                                 // GET  /api/admins/me

module.exports = router;
