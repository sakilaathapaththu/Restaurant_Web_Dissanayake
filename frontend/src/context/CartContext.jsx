import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import cartService from '../services/cartService';

// Cart context
const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
    SET_CART: 'SET_CART',
    ADD_ITEM: 'ADD_ITEM',
    UPDATE_ITEM: 'UPDATE_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    CLEAR_CART: 'CLEAR_CART',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_SUMMARY: 'SET_SUMMARY',
    TOGGLE_PANEL: 'TOGGLE_PANEL',
    CLOSE_PANEL: 'CLOSE_PANEL'
};

// Initial cart state
const initialState = {
    items: [],
    itemCount: 0,
    totalAmount: 0,
    loading: false,
    error: null,
    isPanelOpen: false,
    isCartLoaded: false
};

// Cart reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case CART_ACTIONS.SET_CART:
            console.log('SET_CART action payload:', action.payload);

            // Ensure items is always an array
            const items = Array.isArray(action.payload.items) ? action.payload.items : [];
            const itemCount = typeof action.payload.itemCount === 'number' ? action.payload.itemCount : 0;
            const totalAmount = typeof action.payload.totalAmount === 'number' ? action.payload.totalAmount : 0;

            const newState = {
                ...state,
                items,
                itemCount,
                totalAmount,
                loading: false,
                error: null,
                isCartLoaded: true
            };
            console.log('New cart state:', newState);
            return newState;

        case CART_ACTIONS.SET_SUMMARY:
            return {
                ...state,
                itemCount: action.payload.itemCount || 0,
                totalAmount: action.payload.totalAmount || 0
            };

        case CART_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };

        case CART_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case CART_ACTIONS.CLEAR_CART:
            return {
                ...state,
                items: [],
                itemCount: 0,
                totalAmount: 0,
                loading: false,
                error: null,
                isCartLoaded: false
            };

        case CART_ACTIONS.TOGGLE_PANEL:
            return {
                ...state,
                isPanelOpen: !state.isPanelOpen
            };

        case CART_ACTIONS.CLOSE_PANEL:
            return {
                ...state,
                isPanelOpen: false
            };

        default:
            return state;
    }
};

// Cart provider component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const hasLoadedRef = useRef(false);

    // Load cart on component mount only once
    useEffect(() => {
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            console.log('CartContext: Initial cart load...');
            loadCart();
        }
    }, []);

    // Load cart from server
    const loadCart = async () => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

            // Get guest user ID if no authenticated user
            const guestUserId = cartService.generateGuestUserId();
            console.log('Loading cart for guest user:', guestUserId);
            const cartData = await cartService.getCart(guestUserId);
            console.log('Cart data received:', cartData);

            // Validate cart data structure
            if (cartData && typeof cartData === 'object') {
                console.log('CartContext: Valid cart data, dispatching SET_CART');
                dispatch({ type: CART_ACTIONS.SET_CART, payload: cartData });
            } else {
                console.error('CartContext: Invalid cart data structure:', cartData);
                dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Invalid cart data structure' });
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // Load cart summary (lighter operation for navbar updates)
    const loadCartSummary = async () => {
        try {
            const guestUserId = cartService.generateGuestUserId();
            const summary = await cartService.getCartSummary(guestUserId);
            dispatch({ type: CART_ACTIONS.SET_SUMMARY, payload: summary });
        } catch (error) {
            console.error('Error loading cart summary:', error);
        }
    };

    // Add item to cart
    const addToCart = async (item) => {
        try {
            console.log('CartContext.addToCart called with item:', item);
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

            // Generate guest user ID for the item
            const guestUserId = cartService.generateGuestUserId();
            const itemWithUserId = { ...item, userId: guestUserId };
            console.log('CartContext.addToCart itemWithUserId:', itemWithUserId);

            const result = await cartService.addToCart(itemWithUserId);
            console.log('CartContext.addToCart result:', result);
            dispatch({ type: CART_ACTIONS.SET_CART, payload: result.data });
            return result;
        } catch (error) {
            console.error('CartContext.addToCart error:', error);
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    };

    // Update item quantity
    const updateItemQuantity = async (foodId, quantity, portionIndex = 0) => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

            // Get guest user ID for the operation
            const guestUserId = cartService.generateGuestUserId();
            const result = await cartService.updateItemQuantity(foodId, quantity, portionIndex, guestUserId);
            dispatch({ type: CART_ACTIONS.SET_CART, payload: result.data });
            return result;
        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    };

    // Remove item from cart
    const removeFromCart = async (foodId, portionIndex = 0) => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

            // Get guest user ID for the operation
            const guestUserId = cartService.generateGuestUserId();
            const result = await cartService.removeItem(foodId, portionIndex, guestUserId);
            dispatch({ type: CART_ACTIONS.SET_CART, payload: result.data });
            return result;
        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    };

    // Clear entire cart
    const clearCart = async () => {
        try {
            dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

            // Get guest user ID for the operation
            const guestUserId = cartService.generateGuestUserId();
            await cartService.clearCart(guestUserId);
            dispatch({ type: CART_ACTIONS.CLEAR_CART });
        } catch (error) {
            dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
            throw error;
        }
    };

    // Clear cart locally (without API call)
    const clearCartLocally = () => {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: null });
    };

    // Toggle cart panel
    const toggleCartPanel = () => {
        dispatch({ type: CART_ACTIONS.TOGGLE_PANEL });
    };

    // Close cart panel
    const closeCartPanel = () => {
        dispatch({ type: CART_ACTIONS.CLOSE_PANEL });
    };

    // Context value
    const contextValue = {
        // State
        items: state.items,
        itemCount: state.itemCount,
        totalAmount: state.totalAmount,
        loading: state.loading,
        error: state.error,
        isPanelOpen: state.isPanelOpen,
        isCartLoaded: state.isCartLoaded,

        // Actions
        loadCart,
        loadCartSummary,
        addToCart,
        updateItemQuantity,
        removeFromCart,
        clearCart,
        clearCartLocally,
        clearError,
        toggleCartPanel,
        closeCartPanel
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;