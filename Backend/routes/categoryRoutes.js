const express = require("express");
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

const router = express.Router();

/**
 * Public reads if you want (toggle auth as you prefer)
 * If categories should be visible without login, keep GET routes public.
 * If not, wrap with auth.
 */
router.get("/", getCategories);
router.get("/:id", getCategory);

/**
 * Protected writes — allow superadmin or editor
 */
router.post("/", auth, requireRole("superadmin", "editor"), createCategory);
router.patch("/:id", auth, requireRole("superadmin", "editor"), updateCategory);
router.delete("/:id", auth, requireRole("superadmin", "editor"), deleteCategory);

module.exports = router;
