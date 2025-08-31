const Order = require('../models/Order');
const Cart = require('../models/Cart');

const { sendOrderConfirmed } = require('../services/whatsapp');


// Create a new order from cart
const createOrder = async (req, res) => {
    try {
        const { userId, customerName, customerPhone, address } = req.body;

        // Validate required fields
        if (!userId || !customerName || !customerPhone || !address) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, customerName, customerPhone, address'
            });
        }

        // Get cart items for the user
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Calculate totals
        const totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const deliveryFee = 0; // Fixed delivery fee
        const serviceCharge = 0; // Fixed service charge
        const grandTotal = totalAmount + deliveryFee + serviceCharge;

        // Create order items from cart
        const orderItems = cart.items.map(item => ({
            foodId: item.foodId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selectedPortion: item.selectedPortion,
            totalPrice: item.totalPrice,
            image: item.image
        }));

        // Create new order
        const order = new Order({
            userId,
            items: orderItems,
            totalAmount,
            deliveryFee,
            serviceCharge,
            grandTotal,
            customerName,
            customerPhone,
            address,
            orderType: 'pickup', // Default to delivery
            paymentMethod: 'cash' // Default to cash on delivery
        });

        await order.save();

        // Clear the cart after order creation
        await Cart.findOneAndUpdate(
            { userId },
            { $set: { items: [], itemCount: 0, totalAmount: 0 } }
        );

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, orderType } = req.query;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (orderType) filter.orderType = orderType;

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('items.foodId', 'name image');

        const totalOrders = await Order.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
                hasNext: page * limit < totalOrders,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get orders by user ID
const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('items.foodId', 'name image');

        const totalOrders = await Order.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
                hasNext: page * limit < totalOrders,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get single order by ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate('items.foodId', 'name image description');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update order status (admin)
// const updateOrderStatus = async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         const { status, estimatedDeliveryTime } = req.body;

//         if (!status) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Status is required'
//             });
//         }

//         const updateData = { status };
//         if (estimatedDeliveryTime) {
//             updateData.estimatedDeliveryTime = estimatedDeliveryTime;
//         }

//         // Set actual delivery time if status is delivered
//         if (status === 'delivered') {
//             updateData.actualDeliveryTime = new Date();
//         }

//         const order = await Order.findByIdAndUpdate(
//             orderId,
//             updateData,
//             { new: true, runValidators: true }
//         ).populate('items.foodId', 'name image');

//         if (!order) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Order not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Order status updated successfully',
//             data: order
//         });

//     } catch (error) {
//         console.error('Error updating order status:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//             error: error.message
//         });
//     }
// };

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, estimatedDeliveryTime, pickupTime } = req.body; // ⬅️ pickupTime added

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Build the update payload
    const updateData = { status };
    if (estimatedDeliveryTime) updateData.estimatedDeliveryTime = estimatedDeliveryTime;
    if (pickupTime) updateData.pickupTime = pickupTime; // ⬅️ persist pickup time (string like "15:30" or ISO)

    // Set actual delivery time if status is delivered
    if (status === 'delivered') {
      updateData.actualDeliveryTime = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true, runValidators: true }
    ).populate('items.foodId', 'name image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // ✅ Send WhatsApp only when the order is confirmed
try {
  if (order.status === 'confirmed' && order.customerPhone) {
    await sendOrderConfirmed(order); // uses your services/whatsapp.js helper
  }
} catch (waErr) {
  console.error('WhatsApp send failed:', waErr); // keep API success even if WA fails
}


    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};




// Cancel order
// Fixed cancel order function
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.body;

        console.log('Cancel order request:', { orderId, userId }); // Debug log

        // First, find the order to validate ownership and status
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns the order
        if (order.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
        }

        // Only allow cancellation of pending or confirmed orders
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled. Current status: ${order.status}`
            });
        }

        // Update the order status using findByIdAndUpdate to avoid validation issues
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                status: 'cancelled',
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: false // Skip validation to avoid address requirement
            }
        );

        console.log('Order cancelled successfully:', updatedOrder._id); // Debug log

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: updatedOrder
        });

    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get order statistics (admin)
const getOrderStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const stats = await Order.aggregate([
            {
                $facet: {
                    totalOrders: [{ $count: 'count' }],
                    totalRevenue: [{ $group: { _id: null, total: { $sum: '$grandTotal' } } }],
                    todayOrders: [
                        { $match: { createdAt: { $gte: startOfDay } } },
                        { $count: 'count' }
                    ],
                    todayRevenue: [
                        { $match: { createdAt: { $gte: startOfDay } } },
                        { $group: { _id: null, total: { $sum: '$grandTotal' } } }
                    ],
                    weekOrders: [
                        { $match: { createdAt: { $gte: startOfWeek } } },
                        { $count: 'count' }
                    ],
                    monthOrders: [
                        { $match: { createdAt: { $gte: startOfMonth } } },
                        { $count: 'count' }
                    ],
                    statusCounts: [
                        { $group: { _id: '$status', count: { $sum: 1 } } }
                    ]
                }
            }
        ]);

        const result = {
            totalOrders: stats[0].totalOrders[0]?.count || 0,
            totalRevenue: stats[0].totalRevenue[0]?.total || 0,
            todayOrders: stats[0].todayOrders[0]?.count || 0,
            todayRevenue: stats[0].todayRevenue[0]?.total || 0,
            weekOrders: stats[0].weekOrders[0]?.count || 0,
            monthOrders: stats[0].monthOrders[0]?.count || 0,
            statusCounts: stats[0].statusCounts.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {})
        };

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error fetching order stats:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrdersByUser,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getOrderStats
};