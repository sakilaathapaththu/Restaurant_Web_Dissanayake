const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    selectedPortion: {
        label: {
            type: String,
            default: 'Standard'
        },
        index: {
            type: Number,
            default: 0
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    image: String
});

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [OrderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number },
    serviceCharge: {
        type: Number
        
    },
    grandTotal: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderType: {
        type: String,
        enum: ['delivery', 'pickup'],
        default: 'pickup'
    },
    // Simplified address field - single text field
    address: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'online'],
        default: 'cash'
    },
    pickupTime: { type: String },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;