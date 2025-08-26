const router = require("express").Router();
const adminCtrl = require("../controllers/adminController");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

// Register admin (first time open, later only superadmin)
router.post("/register", adminCtrl.register);

// Login
router.post("/login", adminCtrl.login);

// Me
router.get("/me", auth, adminCtrl.me);

// Update admin (superadmin only)
router.patch("/:id/status", auth, requireRole("superadmin"), adminCtrl.update);

module.exports = router;
