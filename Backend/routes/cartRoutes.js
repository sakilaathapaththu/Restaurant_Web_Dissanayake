const express = require("express");
const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartSummary,
    migrateCartFoodIds
} = require("../controllers/cartController");

const auth = require("../middlewares/auth");

const router = express.Router();

/**
 * Cart routes - can work with both authenticated and guest users
 * For guest users, we'll use session ID or a temporary user ID
 */

// Get cart summary (item count and total) - public for guest users
router.get("/summary", getCartSummary);

// Get full cart details
router.get("/", getCart);

// Add item to cart
router.post("/add", addToCart);

// Update item quantity in cart
router.patch("/item/:foodId", updateCartItem);

// Remove specific item from cart
router.delete("/item/:foodId", removeFromCart);

// Clear entire cart
router.delete("/", clearCart);

// Migration route (should be called once to convert existing data)
router.post("/migrate", migrateCartFoodIds);

module.exports = router;