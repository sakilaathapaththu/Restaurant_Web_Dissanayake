// services/cartService.js
import API from '../Utils/api';

class CartService {
  // Add item to cart
  async addToCart(item) {
    try {
      console.log('CartService.addToCart called with item:', item);
      console.log('Making POST request to /cart/add');
      const response = await API.post('/cart/add', item);
      console.log('CartService.addToCart response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to add item to cart');
    }
  }

  // Get cart contents
  async getCart(userId = null) {
    try {
      console.log('CartService.getCart called with userId:', userId);
      const url = userId ? `/cart?userId=${encodeURIComponent(userId)}` : '/cart';
      console.log('Requesting URL:', url);
      const response = await API.get(url);
      console.log('Cart response:', response.data);
      console.log('Cart response.data:', response.data.data);
      console.log('Cart response.data.items:', response.data.data?.items);
      return response.data.data;
    } catch (error) {
      console.error('Error getting cart:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Failed to get cart');
    }
  }

  // Update item quantity
  async updateItemQuantity(foodId, quantity, portionIndex = 0, userId = null) {
    try {
      const url = userId ? `/cart/item/${foodId}?userId=${encodeURIComponent(userId)}` : `/cart/item/${foodId}`;
      const response = await API.patch(url, {
        quantity,
        portionIndex
      });
      return response.data;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw new Error(error.response?.data?.error || 'Failed to update item quantity');
    }
  }

  // Remove item from cart
  async removeItem(foodId, portionIndex = 0, userId = null) {
    try {
      const url = userId ? `/cart/item/${foodId}?userId=${encodeURIComponent(userId)}&portionIndex=${portionIndex}` : `/cart/item/${foodId}?portionIndex=${portionIndex}`;
      const response = await API.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error removing item:', error);
      throw new Error(error.response?.data?.error || 'Failed to remove item');
    }
  }

  // Clear entire cart
  async clearCart(userId = null) {
    try {
      const url = userId ? `/cart?userId=${encodeURIComponent(userId)}` : '/cart';
      const response = await API.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw new Error(error.response?.data?.error || 'Failed to clear cart');
    }
  }

  // Get cart summary (item count and total)
  async getCartSummary(userId = null) {
    try {
      const url = userId ? `/cart/summary?userId=${encodeURIComponent(userId)}` : '/cart/summary';
      const response = await API.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Error getting cart summary:', error);
      throw new Error(error.response?.data?.error || 'Failed to get cart summary');
    }
  }

  // Utility method to generate guest user ID
  generateGuestUserId() {
    const existingId = localStorage.getItem('guestUserId');
    if (existingId) {
      return existingId;
    }

    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestUserId', guestId);
    return guestId;
  }
}

// Export singleton instance
export default new CartService();