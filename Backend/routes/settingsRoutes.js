const express = require("express");
const { getSettings, getSetting, updateSetting, initializeSettings } = require("../controllers/settingsController");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

const router = express.Router();

// Public routes
router.get("/", getSettings);
router.get("/:key", getSetting);

// Protected routes (admin only)
router.put("/:key", auth, requireRole("superadmin"), updateSetting);
router.post("/initialize", auth, requireRole("superadmin"), initializeSettings);

module.exports = router;
