import API from '../Utils/api';

const orderService = {
    // Create a new order from cart
    createOrder: async (orderData) => {
        try {
            const response = await API.post('/orders/create', orderData);
            return response.data;
        } catch (error) {
            console.error('Create order error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to create order';
            throw new Error(errorMessage);
        }
    },

    // Get all orders (admin)
    getAllOrders: async (params = {}) => {
        try {
            const response = await API.get('/orders/all', { params });
            return response.data;
        } catch (error) {
            console.error('Get all orders error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch orders';
            throw new Error(errorMessage);
        }
    },

    // Get orders by user ID
    getOrdersByUser: async (userId, params = {}) => {
        try {
            const response = await API.get(`/orders/user/${userId}`, { params });
            return response.data;
        } catch (error) {
            console.error('Get orders by user error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch user orders';
            throw new Error(errorMessage);
        }
    },

    // Get single order by ID
    getOrderById: async (orderId) => {
        try {
            const response = await API.get(`/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error('Get order by ID error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch order details';
            throw new Error(errorMessage);
        }
    },

    // Update order status (admin)
    updateOrderStatus: async (orderId, statusData) => {
        try {
            const response = await API.patch(`/orders/${orderId}/status`, statusData);
            return response.data;
        } catch (error) {
            console.error('Update order status error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to update order status';
            throw new Error(errorMessage);
        }
    },

    // Cancel order
    cancelOrder: async (orderId, userId) => {
        try {
            console.log('Cancelling order:', { orderId, userId }); // Debug log
            const response = await API.patch(`/orders/${orderId}/cancel`, { userId });
            return response.data;
        } catch (error) {
            console.error('Cancel order error:', error);

            // More detailed error handling for cancel operation
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const errorData = error.response.data;

                let errorMessage = 'Failed to cancel order';

                if (status === 400) {
                    errorMessage = errorData?.message || 'Bad request - Invalid order data';
                } else if (status === 401) {
                    errorMessage = 'Unauthorized - Please log in again';
                } else if (status === 403) {
                    errorMessage = 'Forbidden - You cannot cancel this order';
                } else if (status === 404) {
                    errorMessage = 'Order not found';
                } else if (status === 409) {
                    errorMessage = errorData?.message || 'Order cannot be cancelled at this time';
                } else if (status >= 500) {
                    errorMessage = 'Server error - Please try again later';
                } else {
                    errorMessage = errorData?.message || errorData?.error || errorMessage;
                }

                throw new Error(errorMessage);
            } else if (error.request) {
                // Network error
                throw new Error('Network error - Please check your connection');
            } else {
                // Other error
                throw new Error(error.message || 'Failed to cancel order');
            }
        }
    },

    // Get order statistics (admin)
    getOrderStats: async () => {
        try {
            const response = await API.get('/orders/stats/overview');
            return response.data;
        } catch (error) {
            console.error('Get order stats error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch order statistics';
            throw new Error(errorMessage);
        }
    }
};

export default orderService;