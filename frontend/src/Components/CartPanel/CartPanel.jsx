import React, { useEffect, useState } from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Card,
    CardContent,
    CardMedia,
    Button,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    Chip,
    TextField,
    Paper
} from '@mui/material';
import {
    Add,
    Remove,
    Delete,
    ShoppingCart,
    Close,
    ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartPanel = ({ open, onClose }) => {
    const navigate = useNavigate();
    const {
        items,
        itemCount,
        totalAmount,
        loading,
        error,
        isCartLoaded,
        loadCart,
        updateItemQuantity,
        removeFromCart,
        clearCart,
        clearError,
        closeCartPanel
    } = useCart();

    const [updatingItems, setUpdatingItems] = useState(new Set());
    const [removingItems, setRemovingItems] = useState(new Set());

    // Debug logging
    console.log('CartPanel render - items:', items, 'itemCount:', itemCount, 'totalAmount:', totalAmount, 'loading:', loading, 'isCartLoaded:', isCartLoaded);

    // Only load cart once when component mounts, not every time panel opens
    useEffect(() => {
        if (!isCartLoaded && !loading) {
            console.log('CartPanel: Loading cart...');
            loadCart();
        }
    }, [isCartLoaded, loading, loadCart]);

    // Handle quantity update
    const handleQuantityUpdate = async (item, newQuantity) => {
        if (newQuantity < 1) return;

        // Add safety checks
        if (!item || !item.foodId || !item.selectedPortion) {
            console.error('Invalid item structure for quantity update:', item);
            return;
        }

        const itemKey = `${item.foodId.toString()}_${item.selectedPortion.index}`;
        setUpdatingItems(prev => new Set(prev).add(itemKey));

        try {
            await updateItemQuantity(item.foodId, newQuantity, item.selectedPortion.index);
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemKey);
                return newSet;
            });
        }
    };

    // Handle item removal
    const handleRemoveItem = async (item) => {
        // Add safety checks
        if (!item || !item.foodId || !item.selectedPortion) {
            console.error('Invalid item structure for removal:', item);
            return;
        }

        const itemKey = `${item.foodId.toString()}_${item.selectedPortion.index}`;
        setRemovingItems(prev => new Set(prev).add(itemKey));

        try {
            await removeFromCart(item.foodId, item.selectedPortion.index);
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemKey);
                return newSet;
            });
        }
    };

    // Handle clear cart
    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                await clearCart();
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        }
    };

    // Handle checkout
    const handleCheckout = () => {
        closeCartPanel();
        navigate('/checkout');
    };

    // Handle continue shopping
    const handleContinueShopping = () => {
        closeCartPanel();
        navigate('/menu');
    };

    const drawerWidth = 400;

    // Don't render anything if cart is not loaded yet
    if (!isCartLoaded && !loading) {
        return null;
    }

    // Don't render if items is undefined (cart not loaded yet)
    if (items === undefined) {
        console.log('CartPanel: items is undefined, not rendering');
        return null;
    }

    // Don't render if items is not an array (cart not loaded yet)
    if (!Array.isArray(items)) {
        console.log('CartPanel: items is not an array, not rendering. items:', items);
        return null;
    }

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: { xs: '100%', sm: drawerWidth },
                    maxWidth: '100vw',
                    height: '100%',
                    backgroundColor: '#fff',
                    boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
                }
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{
                    p: 2.5,
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: '#3c1300',
                    color: 'white'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ShoppingCart sx={{ fontSize: 26, color: '#fda021' }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Your Cart {isCartLoaded && Array.isArray(items) && itemCount > 0 && `(${itemCount || 0})`}
                            </Typography>
                        </Box>
                        <IconButton onClick={onClose} sx={{ color: 'white' }}>
                            <Close />
                        </IconButton>
                    </Box>
                </Box>

                {/* Content - Cart Items with more height and no scroll bars */}
                <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {/* Error Alert */}
                    {error && (
                        <Alert
                            severity="error"
                            onClose={clearError}
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Loading State - Show when cart is not loaded yet */}
                    {!isCartLoaded && loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                            <Typography variant="body1" sx={{ ml: 2 }}>
                                Loading cart...
                            </Typography>
                        </Box>
                    )}

                    {/* Loading State - Show when cart is loaded but empty */}
                    {isCartLoaded && loading && (!Array.isArray(items) || items.length === 0) && (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                        </Box>
                    )}

                    {/* Empty Cart */}
                    {isCartLoaded && (!Array.isArray(items) || items.length === 0) && !loading ? (
                        <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
                            <ShoppingCart sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
                                Your cart is empty
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3, color: '#999' }}>
                                Add some delicious items from our menu to get started!
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleContinueShopping}
                                sx={{
                                    backgroundColor: '#06c167',
                                    '&:hover': { backgroundColor: '#05a356' },
                                    px: 4
                                }}
                            >
                                Browse Menu
                            </Button>
                        </Paper>
                    ) : isCartLoaded && Array.isArray(items) && items.length > 0 ? (
                        <>
                            {/* Cart Items Header */}
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Cart Items</Typography>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={handleClearCart}
                                    disabled={loading}
                                >
                                    Clear Cart
                                </Button>
                            </Box>

                            {/* Items List with increased height and removed scroll bars */}
                            <Box sx={{
                                flex: 1,
                                mb: 2,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Box sx={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    '&::-webkit-scrollbar': {
                                        display: 'none'
                                    },
                                    '-ms-overflow-style': 'none',
                                    'scrollbar-width': 'none'
                                }}>
                                    {Array.isArray(items) && items.map((item, index) => {
                                        // Add safety checks for item properties
                                        if (!item || !item.foodId || !item.selectedPortion) {
                                            console.warn('Invalid item structure:', item);
                                            return null;
                                        }

                                        const itemKey = `${item.foodId.toString()}_${item.selectedPortion.index}`;
                                        const isUpdating = updatingItems.has(itemKey);
                                        const isRemoving = removingItems.has(itemKey);

                                        return (
                                            <Card key={`${item.foodId.toString()}_${item.selectedPortion.index}_${index}`} sx={{ mb: 1.5 }}>
                                                <CardContent sx={{ p: 1.5 }}>
                                                    <Grid container spacing={1.5} alignItems="center">
                                                        {/* Item Image - Smaller */}
                                                        <Grid item xs={3}>
                                                            <CardMedia
                                                                component="img"
                                                                image={item.image || '/placeholder-food.jpg'}
                                                                alt={item.name || 'Food Item'}
                                                                sx={{
                                                                    width: '100%',
                                                                    height: 60,
                                                                    objectFit: 'cover',
                                                                    borderRadius: 1
                                                                }}
                                                            />
                                                        </Grid>

                                                        {/* Item Details - Smaller text */}
                                                        <Grid item xs={9}>
                                                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                                {item.name || 'Unknown Item'}
                                                            </Typography>

                                                            {item.selectedPortion?.label && item.selectedPortion.label !== 'Standard' && (
                                                                <Chip
                                                                    label={item.selectedPortion.label}
                                                                    size="small"
                                                                    sx={{
                                                                        mb: 0.5,
                                                                        backgroundColor: '#f0f0f0',
                                                                        height: 20,
                                                                        fontSize: '0.7rem'
                                                                    }}
                                                                />
                                                            )}

                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                                LKR {item.price ? item.price.toLocaleString() : '0'}
                                                            </Typography>

                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#06c167', fontSize: '0.85rem' }}>
                                                                LKR {item.totalPrice ? item.totalPrice.toLocaleString() : '0'}
                                                            </Typography>
                                                        </Grid>

                                                        {/* Quantity Controls - Smaller */}
                                                        <Grid item xs={12}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleQuantityUpdate(item, (item.quantity || 1) - 1)}
                                                                        disabled={(item.quantity || 1) <= 1 || isUpdating || isRemoving}
                                                                        sx={{
                                                                            border: '1px solid #ddd',
                                                                            width: 28,
                                                                            height: 28
                                                                        }}
                                                                    >
                                                                        <Remove fontSize="small" />
                                                                    </IconButton>

                                                                    <TextField
                                                                        size="small"
                                                                        value={item.quantity || 1}
                                                                        inputProps={{
                                                                            style: { textAlign: 'center', width: '30px', padding: '4px' },
                                                                            readOnly: true
                                                                        }}
                                                                        sx={{
                                                                            '& .MuiOutlinedInput-root': {
                                                                                height: 28
                                                                            }
                                                                        }}
                                                                    />

                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleQuantityUpdate(item, (item.quantity || 1) + 1)}
                                                                        disabled={isUpdating || isRemoving}
                                                                        sx={{
                                                                            border: '1px solid #ddd',
                                                                            width: 28,
                                                                            height: 28
                                                                        }}
                                                                    >
                                                                        <Add fontSize="small" />
                                                                    </IconButton>
                                                                </Box>

                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    size="small"
                                                                    onClick={() => handleRemoveItem(item)}
                                                                    disabled={isUpdating || isRemoving}
                                                                    startIcon={isRemoving ? <CircularProgress size={12} /> : <Delete sx={{ fontSize: 16 }} />}
                                                                    sx={{
                                                                        minWidth: 'auto',
                                                                        px: 1,
                                                                        py: 0.5,
                                                                        fontSize: '0.75rem'
                                                                    }}
                                                                >
                                                                    {isRemoving ? 'Removing...' : 'Remove'}
                                                                </Button>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        );
                                    }).filter(Boolean)}
                                </Box>
                            </Box>
                        </>
                    ) : null}
                </Box>

                {/* Footer - Compact Order Summary and Actions with smaller buttons */}
                {isCartLoaded && Array.isArray(items) && items.length > 0 && (
                    <Box sx={{
                        p: 2,
                        borderTop: '1px solid #e0e0e0',
                        backgroundColor: '#fafafa'
                    }}>
                        {/* Compact Order Summary */}
                        <Paper sx={{ p: 1.5, mb: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Order Summary
                            </Typography>

                            <Box sx={{ mb: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption">Items ({itemCount || 0})</Typography>
                                    <Typography variant="caption">
                                        LKR {(totalAmount || 0).toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption">Delivery Fee</Typography>
                                    <Typography variant="caption">LKR 200</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption">Service Charge</Typography>
                                    <Typography variant="caption">LKR 50</Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 1 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    Total
                                </Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#06c167' }}>
                                    LKR {((totalAmount || 0) + 250).toLocaleString()}
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Action Buttons - Smaller */}
                        <Button
                            variant="contained"
                            fullWidth
                            size="medium"
                            disabled={loading || !Array.isArray(items) || items.length === 0}
                            onClick={handleCheckout}
                            sx={{
                                backgroundColor: '#06c167',
                                '&:hover': { backgroundColor: '#05a356' },
                                py: 1,
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                mb: 1,
                                borderRadius: 2
                            }}
                            endIcon={<ArrowForward />}
                        >
                            Proceed to Checkout
                        </Button>

                        <Button
                            variant="outlined"
                            fullWidth
                            size="medium"
                            onClick={handleContinueShopping}
                            sx={{
                                borderColor: '#06c167',
                                color: '#06c167',
                                '&:hover': {
                                    borderColor: '#05a356',
                                    backgroundColor: 'rgba(6, 193, 103, 0.04)'
                                },
                                py: 0.75,
                                borderRadius: 2,
                                fontSize: '0.85rem'
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default CartPanel;