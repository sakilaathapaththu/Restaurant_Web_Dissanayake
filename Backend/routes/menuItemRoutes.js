// const express = require("express");
// const {
//   createMenuItem,
//   getMenuItems,
//   getMenuItem,
//   updateMenuItem,
//   toggleMenuItem,
// } = require("../controllers/menuItemController");

// const auth = require("../middlewares/auth");
// const requireRole = require("../middlewares/requireRole");

// const router = express.Router();

// /** Public reads (you can wrap with auth if needed) */
// router.get("/", getMenuItems);
// router.get("/:id", getMenuItem);

// /** Protected writes */
// router.post("/", auth, requireRole("superadmin", "editor"), createMenuItem);
// router.patch("/:id", auth, requireRole("superadmin", "editor"), updateMenuItem);
// router.patch("/:id/toggle", auth, requireRole("superadmin", "editor"), toggleMenuItem);

// module.exports = router;
const express = require("express");
const {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  toggleMenuItem,
  setMenuItemImage,        // NEW
  removeMenuItemImage,     // NEW
  getMenuItemImage,        // NEW
} = require("../controllers/menuItemController");

const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

// multer (memory) for Vercel-friendly uploads
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Math.floor(1.5 * 1024 * 1024) }, // ~1.5MB
});

const router = express.Router();

/** Public reads (keep or secure as you prefer) */
router.get("/", getMenuItems);
router.get("/:id", getMenuItem);
router.get("/:id/image", getMenuItemImage); // serve image binary

/** Protected writes */
router.post("/", auth, requireRole("superadmin", "editor"), createMenuItem);
router.patch("/:id", auth, requireRole("superadmin", "editor"), updateMenuItem);
router.patch("/:id/toggle", auth, requireRole("superadmin", "editor"), toggleMenuItem);

// 🔥 Image upload/remove (multipart or delete)
router.post(
  "/:id/image",
  auth,
  requireRole("superadmin", "editor"),
  upload.single("image"),
  setMenuItemImage
);

router.delete(
  "/:id/image",
  auth,
  requireRole("superadmin", "editor"),
  removeMenuItemImage
);

module.exports = router;
