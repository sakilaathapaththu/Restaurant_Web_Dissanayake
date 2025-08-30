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

    useEffect(() => {
        if (!isCartLoaded && !loading) {
            loadCart();
        }
    }, [isCartLoaded, loading, loadCart]);

    const handleQuantityUpdate = async (item, newQuantity) => {
        if (newQuantity < 1) return;
        if (!item || !item.foodId || !item.selectedPortion) return;

        const itemKey = `${item.foodId}_${item.selectedPortion.index}`;
        setUpdatingItems(prev => new Set(prev).add(itemKey));

        try {
            await updateItemQuantity(item.foodId, newQuantity, item.selectedPortion.index);
        } catch (error) {
            console.error(error);
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemKey);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (item) => {
        if (!item || !item.foodId || !item.selectedPortion) return;

        const itemKey = `${item.foodId}_${item.selectedPortion.index}`;
        setRemovingItems(prev => new Set(prev).add(itemKey));

        try {
            await removeFromCart(item.foodId, item.selectedPortion.index);
        } catch (error) {
            console.error(error);
        } finally {
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemKey);
                return newSet;
            });
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            try {
                await clearCart();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleCheckout = () => {
        closeCartPanel();
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        closeCartPanel();
        navigate('/menu');
    };

    const drawerWidth = 400;

    if (!isCartLoaded && !loading) return null;
    if (!items || !Array.isArray(items)) return null;

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
                    backgroundColor: '#fff5ee', // Seashell White
                    boxShadow: '-4px 0 20px rgba(0,0,0,0.1)'
                }
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff5ee' }}>
                {/* Header */}
                <Box sx={{
                    p: 2.5,
                    borderBottom: '1px solid #e8d5c4',
                    backgroundColor: '#2c1000',
                    color: '#fda021'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ShoppingCart sx={{ fontSize: 26, color: '#fda021' }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fda021' }}>
                                Your Cart {isCartLoaded && Array.isArray(items) && itemCount > 0 && `(${itemCount})`}
                            </Typography>
                        </Box>
                        <IconButton onClick={onClose} sx={{ color: '#fda021' }}>
                            <Close />
                        </IconButton>
                    </Box>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {error && (
                        <Alert severity="error" onClose={clearError} sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {!isCartLoaded && loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                            <Typography variant="body1" sx={{ ml: 2 }}>Loading cart...</Typography>
                        </Box>
                    )}

                    {isCartLoaded && items.length === 0 && !loading && (
                        <Paper sx={{ p: 4, textAlign: 'center', mt: 2, backgroundColor: '#fff5ee' }}>
                            <ShoppingCart sx={{ fontSize: 64, color: '#e8d5c4', mb: 2 }} />
                            <Typography variant="h6" sx={{ mb: 2, color: '#2c1000' }}>
                                Your cart is empty
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 3, color: '#2c1000' }}>
                                Add some delicious items from our menu to get started!
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleContinueShopping}
                                sx={{
                                    backgroundColor: '#fda021',
                                    '&:hover': { backgroundColor: '#e8d5c4', color: '#2c1000' },
                                    px: 4
                                }}
                            >
                                Browse Menu
                            </Button>
                        </Paper>
                    )}

                    {items.length > 0 && (
                        <>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2c1000' }}>Cart Items</Typography>
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
                                    '&::-webkit-scrollbar': { display: 'none' },
                                    '-ms-overflow-style': 'none',
                                    'scrollbar-width': 'none'
                                }}>
                                    {items.map((item, index) => {
                                        if (!item || !item.foodId || !item.selectedPortion) return null;
                                        const itemKey = `${item.foodId}_${item.selectedPortion.index}`;
                                        const isUpdating = updatingItems.has(itemKey);
                                        const isRemoving = removingItems.has(itemKey);

                                        return (
                                            <Card key={`${item.foodId}_${index}`} sx={{ mb: 1.5, backgroundColor: '#ffffffff' }}>
                                                <CardContent sx={{ p: 1.5 }}>
                                                    <Grid container spacing={1.5} alignItems="center">
                                                        <Grid item xs={3}>
                                                            <CardMedia
                                                                component="img"
                                                                image={item.image || '/placeholder-food.jpg'}
                                                                alt={item.name || 'Food Item'}
                                                                sx={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 1 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={9}>
                                                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold', fontSize: '0.9rem', color: '#2c1000' }}>
                                                                {item.name || 'Unknown Item'}
                                                            </Typography>
                                                            {item.selectedPortion?.label && item.selectedPortion.label !== 'Standard' && (
                                                                <Chip
                                                                    label={item.selectedPortion.label}
                                                                    size="small"
                                                                    sx={{ mb: 0.5, backgroundColor: '#fda021', height: 20, fontSize: '0.7rem', color: '#2c1000' }}
                                                                />
                                                            )}
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                                LKR {item.price?.toLocaleString() || '0'}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2c1000', fontSize: '0.85rem' }}>
                                                                LKR {item.totalPrice?.toLocaleString() || '0'}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleQuantityUpdate(item, (item.quantity || 1) - 1)}
                                                                        disabled={(item.quantity || 1) <= 1 || isUpdating || isRemoving}
                                                                        sx={{ border: '1px solid #2c1000', width: 28, height: 28 }}
                                                                    >
                                                                        <Remove fontSize="small" />
                                                                    </IconButton>
                                                                    <TextField
                                                                        size="small"
                                                                        value={item.quantity || 1}
                                                                        inputProps={{ style: { textAlign: 'center', width: '30px', padding: '4px' }, readOnly: true }}
                                                                        sx={{ '& .MuiOutlinedInput-root': { height: 28 } }}
                                                                    />
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleQuantityUpdate(item, (item.quantity || 1) + 1)}
                                                                        disabled={isUpdating || isRemoving}
                                                                        sx={{ border: '1px solid #2c1000', width: 28, height: 28 }}
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
                                                                    sx={{ minWidth: 'auto', px: 1, py: 0.5, fontSize: '0.75rem' }}
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
                    )}
                </Box>

                {/* Footer */}
                {items.length > 0 && (
                    <Box sx={{ p: 2, borderTop: '1px solid #e8d5c4', backgroundColor: '#fff5ee' }}>
                        <Paper sx={{ p: 1.5, mb: 1.5, backgroundColor: '#ffffffff' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#2c1000' }}>Order Summary</Typography>
                            <Box sx={{ mb: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: '#2c1000' }}>Items ({itemCount || 0})</Typography>
                                    <Typography variant="caption" sx={{ color: '#2c1000' }}>LKR {(totalAmount || 0).toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: '#2c1000' }}>Delivery Fee</Typography>
                                    <Typography variant="caption" sx={{ color: '#2c1000' }}>LKR 200</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: '#2c1000' }}>Service Charge</Typography>
                                    <Typography variant="caption" sx={{ color: '#2c1000' }}>LKR 50</Typography>
                                </Box>
                            </Box>
                            <Divider sx={{ mb: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2c1000' }}>Total</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#fda021' }}>
                                    LKR {((totalAmount || 0) + 250).toLocaleString()}
                                </Typography>
                            </Box>
                        </Paper>

                        <Button
                            variant="contained"
                            fullWidth
                            size="medium"
                            disabled={loading || items.length === 0}
                            onClick={handleCheckout}
                            sx={{
                                backgroundColor: '#fda021',
                                '&:hover': { backgroundColor: '#e8d5c4', color: '#2c1000' },
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
                                borderColor: '#2c1000',
                                color: '#2c1000',
                                '&:hover': { borderColor: '#fda021', backgroundColor: 'rgba(253, 160, 33, 0.1)' },
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
