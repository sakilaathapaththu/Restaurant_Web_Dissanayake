import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardMedia,
    Button,
    IconButton,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    Paper,
    Chip,
    TextField
} from '@mui/material';
import {
    Add,
    Remove,
    Delete,
    ShoppingCart,
    ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const navigate = useNavigate();
    const {
        items,
        itemCount,
        totalAmount,
        loading,
        error,
        loadCart,
        updateItemQuantity,
        removeFromCart,
        clearCart,
        clearError
    } = useCart();

    const [updatingItems, setUpdatingItems] = useState(new Set());
    const [removingItems, setRemovingItems] = useState(new Set());

    useEffect(() => {
        loadCart();
    }, []);

    // Handle quantity update
    const handleQuantityUpdate = async (item, newQuantity) => {
        if (newQuantity < 1) return;

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

    if (loading && items.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                    <ArrowBack />
                </IconButton>
                <ShoppingCart sx={{ fontSize: 28, color: '#06c167' }} />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Your Cart
                </Typography>
                {itemCount > 0 && (
                    <Chip
                        label={`${itemCount} item${itemCount !== 1 ? 's' : ''}`}
                        color="primary"
                        sx={{ backgroundColor: '#06c167' }}
                    />
                )}
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert
                    severity="error"
                    onClose={clearError}
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            {/* Empty Cart */}
            {items.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <ShoppingCart sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
                        Your cart is empty
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: '#999' }}>
                        Add some delicious items from our menu to get started!
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/menu')}
                        sx={{
                            backgroundColor: '#06c167',
                            '&:hover': { backgroundColor: '#05a356' },
                            px: 4
                        }}
                    >
                        Browse Menu
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {/* Cart Items */}
                    <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Cart Items</Typography>
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

                        {items.map((item, index) => {
                            const itemKey = `${item.foodId.toString()}_${item.selectedPortion.index}`;
                            const isUpdating = updatingItems.has(itemKey);
                            const isRemoving = removingItems.has(itemKey);

                            return (
                                <Card key={`${item.foodId.toString()}_${item.selectedPortion.index}_${index}`} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            {/* Item Image */}
                                            <Grid item xs={12} sm={3}>
                                                <CardMedia
                                                    component="img"
                                                    image={item.image || '/placeholder-food.jpg'}
                                                    alt={item.name}
                                                    sx={{
                                                        width: '100%',
                                                        height: 120,
                                                        objectFit: 'cover',
                                                        borderRadius: 1
                                                    }}
                                                />
                                            </Grid>

                                            {/* Item Details */}
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" sx={{ mb: 1 }}>
                                                    {item.name}
                                                </Typography>

                                                {item.selectedPortion.label !== 'Standard' && (
                                                    <Chip
                                                        label={item.selectedPortion.label}
                                                        size="small"
                                                        sx={{ mb: 1, backgroundColor: '#f0f0f0' }}
                                                    />
                                                )}

                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Price: LKR {item.price.toLocaleString()}
                                                </Typography>

                                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#06c167' }}>
                                                    Subtotal: LKR {item.totalPrice.toLocaleString()}
                                                </Typography>
                                            </Grid>

                                            {/* Quantity Controls */}
                                            <Grid item xs={12} sm={3}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityUpdate(item, item.quantity - 1)}
                                                        disabled={item.quantity <= 1 || isUpdating || isRemoving}
                                                        sx={{ border: '1px solid #ddd' }}
                                                    >
                                                        <Remove fontSize="small" />
                                                    </IconButton>

                                                    <TextField
                                                        size="small"
                                                        value={item.quantity}
                                                        inputProps={{
                                                            style: { textAlign: 'center', width: '50px' },
                                                            readOnly: true
                                                        }}
                                                    />

                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityUpdate(item, item.quantity + 1)}
                                                        disabled={isUpdating || isRemoving}
                                                        sx={{ border: '1px solid #ddd' }}
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
                                                    startIcon={isRemoving ? <CircularProgress size={16} /> : <Delete />}
                                                    fullWidth
                                                >
                                                    {isRemoving ? 'Removing...' : 'Remove'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Grid>

                    {/* Order Summary */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Order Summary
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Items ({itemCount})</Typography>
                                    <Typography variant="body2">
                                        LKR {totalAmount.toLocaleString()}
                                    </Typography>
                                </Box>

                                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Delivery Fee</Typography>
                                    <Typography variant="body2">LKR 200</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Service Charge</Typography>
                                    <Typography variant="body2">LKR 50</Typography>
                                </Box> */}
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Total
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#06c167' }}>
                                    LKR {(totalAmount).toLocaleString()}
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading || items.length === 0}
                                sx={{
                                    backgroundColor: '#06c167',
                                    '&:hover': { backgroundColor: '#05a356' },
                                    py: 1.5,
                                    fontSize: '1.1rem'
                                }}
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </Button>

                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={() => navigate('/menu')}
                            >
                                Continue Shopping
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default CartPage;