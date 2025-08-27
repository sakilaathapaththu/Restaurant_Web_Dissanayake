const express = require("express");
const {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  toggleMenuItem,
} = require("../controllers/menuItemController");

const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

const router = express.Router();

/** Public reads (you can wrap with auth if needed) */
router.get("/", getMenuItems);
router.get("/:id", getMenuItem);

/** Protected writes */
router.post("/", auth, requireRole("superadmin", "editor"), createMenuItem);
router.patch("/:id", auth, requireRole("superadmin", "editor"), updateMenuItem);
router.patch("/:id/toggle", auth, requireRole("superadmin", "editor"), toggleMenuItem);

module.exports = router;
