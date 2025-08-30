const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Create new order from cart
router.post('/create', orderController.createOrder);

// Get all orders (admin)
router.get('/all', orderController.getAllOrders);

// Get orders by user ID
router.get('/user/:userId', orderController.getOrdersByUser);

// Get single order by ID
router.get('/:orderId', orderController.getOrderById);

// Update order status (admin)
router.patch('/:orderId/status', orderController.updateOrderStatus);

// Cancel order
router.patch('/:orderId/cancel', orderController.cancelOrder);

// Get order statistics (admin)
router.get('/stats/overview', orderController.getOrderStats);

module.exports = router;
