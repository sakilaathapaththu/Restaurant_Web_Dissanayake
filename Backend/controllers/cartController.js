const Cart = require("../models/Cart");
const mongoose = require("mongoose");

// Add item to cart
// POST /api/cart/add
exports.addToCart = async (req, res, next) => {
    try {
        console.log('addToCart called with body:', req.body);
        console.log('addToCart headers:', req.headers);

        const {
            foodId,
            name,
            image,
            price,
            quantity = 1,
            selectedPortion
        } = req.body;

        // Validate required fields
        console.log('Validating fields - foodId:', foodId, 'name:', name, 'price:', price);
        if (!foodId || !name || !price) {
            console.log('Validation failed - missing required fields');
            return res.status(400).json({
                success: false,
                error: "foodId, name, and price are required"
            });
        }

        // Validate that foodId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(foodId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid foodId format"
            });
        }

        // For authenticated users, use their user ID. For guests, use session ID or generate one
        const userId = req.body.userId || req.user?.sub || req.sessionID || `guest_${Date.now()}`;

        // Ensure selectedPortion has the correct structure
        const safeSelectedPortion = {
            index: selectedPortion?.index || 0,
            label: selectedPortion?.label || "Standard",
            price: selectedPortion?.price || price
        };

        // Calculate item total price
        const itemPrice = safeSelectedPortion.price;
        const totalPrice = itemPrice * quantity;

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        } else {
            // Clean up any malformed cart items (items without required fields)
            cart.items = cart.items.filter(item =>
                item &&
                item.foodId &&
                item.name &&
                typeof item.price === 'number' &&
                item.selectedPortion &&
                typeof item.selectedPortion.index === 'number'
            );
        }

        // Check if item with same portion already exists
        console.log('Checking for existing item with foodId:', foodId, 'and portion index:', safeSelectedPortion.index);
        console.log('Current cart items:', cart.items.map(item => ({
            foodId: item.foodId,
            name: item.name,
            selectedPortion: item.selectedPortion
        })));

        const existingItemIndex = cart.items.findIndex(item =>
            item.foodId && item.foodId.toString() === foodId.toString() &&
            item.selectedPortion && item.selectedPortion.index === safeSelectedPortion.index
        );

        if (existingItemIndex > -1) {
            // Update existing item quantity
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].totalPrice =
                cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
        } else {
            // Add new item to cart
            cart.items.push({
                foodId,
                name,
                image,
                price: itemPrice,
                quantity,
                selectedPortion: safeSelectedPortion,
                totalPrice
            });
        }

        // Validate cart items before saving
        cart.items.forEach((item, index) => {
            if (!item.foodId || !item.name || typeof item.price !== 'number' || !item.selectedPortion) {
                console.error(`Invalid cart item at index ${index}:`, item);
                throw new Error(`Invalid cart item structure at index ${index}`);
            }
        });

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

// Get user's cart
// GET /api/cart
exports.getCart = async (req, res, next) => {
    try {
        console.log('getCart called with query:', req.query);
        console.log('getCart called with user:', req.user);
        console.log('getCart called with sessionID:', req.sessionID);

        // For guest users, check query params first, then session, then authenticated user
        const userId = req.query.userId || req.user?.sub || req.sessionID;

        console.log('Resolved userId:', userId);

        if (!userId) {
            console.log('No userId found, returning 400');
            return res.status(400).json({
                success: false,
                error: "User identification required"
            });
        }

        console.log('Looking for cart with userId:', userId);
        const cart = await Cart.findOne({ userId });
        console.log('Found cart:', cart);

        if (!cart) {
            console.log('No cart found, returning empty cart');
            return res.status(200).json({
                success: true,
                data: { userId, items: [], totalAmount: 0, itemCount: 0 }
            });
        }

        console.log('Returning cart data');
        res.json({ success: true, data: cart });
    } catch (err) {
        console.error('Error in getCart:', err);
        next(err);
    }
};

// Update item quantity in cart
// PATCH /api/cart/item/:foodId
exports.updateCartItem = async (req, res, next) => {
    try {
        const { foodId } = req.params;
        const { quantity, portionIndex } = req.body;
        const userId = req.query.userId || req.user?.sub || req.sessionID;

        // Validate that foodId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(foodId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid foodId format"
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User identification required"
            });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                error: "Quantity must be at least 1"
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(item =>
            item.foodId && item.foodId.toString() === foodId.toString() &&
            item.selectedPortion && item.selectedPortion.index === (portionIndex || 0)
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                error: "Item not found in cart"
            });
        }

        // Update quantity and total price
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].totalPrice = cart.items[itemIndex].price * quantity;

        await cart.save();

        res.json({
            success: true,
            message: "Cart item updated successfully",
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

// Remove item from cart
// DELETE /api/cart/item/:foodId
exports.removeFromCart = async (req, res, next) => {
    try {
        const { foodId } = req.params;
        const { portionIndex } = req.query;
        const userId = req.query.userId || req.user?.sub || req.sessionID;

        // Validate that foodId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(foodId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid foodId format"
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User identification required"
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: "Cart not found"
            });
        }

        // Filter out the item to remove
        cart.items = cart.items.filter(item =>
            !(item.foodId && item.foodId.toString() === foodId.toString() &&
                item.selectedPortion && item.selectedPortion.index === parseInt(portionIndex || 0))
        );

        await cart.save();

        res.json({
            success: true,
            message: "Item removed from cart successfully",
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

// Clear entire cart
// DELETE /api/cart
exports.clearCart = async (req, res, next) => {
    try {
        const userId = req.query.userId || req.user?.sub || req.sessionID;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User identification required"
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                error: "Cart not found"
            });
        }

        cart.items = [];
        await cart.save();

        res.json({
            success: true,
            message: "Cart cleared successfully",
            data: cart
        });
    } catch (err) {
        next(err);
    }
};

// Get cart summary (item count and total)
// GET /api/cart/summary
exports.getCartSummary = async (req, res, next) => {
    try {
        const userId = req.user?.sub || req.sessionID || req.query.userId;

        if (!userId) {
            return res.status(200).json({
                success: true,
                data: { itemCount: 0, totalAmount: 0 }
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: { itemCount: 0, totalAmount: 0 }
            });
        }

        res.json({
            success: true,
            data: {
                itemCount: cart.itemCount,
                totalAmount: cart.totalAmount
            }
        });
    } catch (err) {
        next(err);
    }
};

// Migration function to convert string foodIds to ObjectIds
// This should be called once to migrate existing data
exports.migrateCartFoodIds = async (req, res, next) => {
    try {
        const MenuItem = require('../models/MenuItem');

        // Find all carts with string foodIds
        const carts = await Cart.find({
            'items.foodId': { $type: 'string' }
        });

        let migratedCount = 0;

        for (const cart of carts) {
            let hasChanges = false;

            for (const item of cart.items) {
                if (typeof item.foodId === 'string') {
                    // Try to find the MenuItem by menuId
                    const menuItem = await MenuItem.findOne({ menuId: item.foodId });
                    if (menuItem) {
                        item.foodId = menuItem._id;
                        hasChanges = true;
                    }
                }
            }

            if (hasChanges) {
                await cart.save();
                migratedCount++;
            }
        }

        res.json({
            success: true,
            message: `Migration completed. ${migratedCount} carts updated.`,
            migratedCount
        });
    } catch (err) {
        next(err);
    }
};