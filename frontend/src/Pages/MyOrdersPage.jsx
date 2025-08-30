import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Card,
    CardContent,
    Grid,
    Box,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Pagination,
    Divider,
    CardMedia,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Visibility,
    Cancel,
    ShoppingBag,
    LocalShipping,
    CheckCircle,
    Schedule,
    Error
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import cartService from '../services/cartService';
import Homepagenavbar from '../Components/Navbar/Homepagenavbar';

const MyOrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cancellingOrder, setCancellingOrder] = useState(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        loadOrders();
    }, [page]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const guestUserId = cartService.generateGuestUserId();
            const response = await orderService.getOrdersByUser(guestUserId, { page, limit: 10 });

            if (response.success) {
                // Include confirmed orders
                const filteredOrders = response.data.filter(order =>
                    !['cancelled'].includes(order.status)
                );
                setOrders(filteredOrders);
                setTotalPages(response.pagination.totalPages);
                setTotalOrders(response.pagination.totalOrders);
            }
        } catch (error) {
            setError(error.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const handleCancelOrder = async (order) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            setCancellingOrder(order._id);
            const guestUserId = cartService.generateGuestUserId();
            await orderService.cancelOrder(order._id, guestUserId);
            await loadOrders();

            if (selectedOrder?._id === order._id) {
                setDialogOpen(false);
                setSelectedOrder(null);
            }
        } catch (error) {
            alert(error.message || 'Failed to cancel order');
        } finally {
            setCancellingOrder(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'confirmed': return 'info';
            case 'preparing': return 'primary';
            case 'ready': return 'secondary';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Schedule />;
            case 'confirmed': return <CheckCircle />;
            case 'preparing': return <ShoppingBag />;
            case 'ready': return <LocalShipping />;
            case 'delivered': return <CheckCircle />;
            case 'cancelled': return <Error />;
            default: return <Schedule />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && orders.length === 0) {
        return (
            <Box sx={{ backgroundColor: '#FFF3E8', minHeight: '100vh' }}>
                <Homepagenavbar />
                <Box sx={{ px: 2, py: 4 }}>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <CircularProgress />
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#FFF3E8', minHeight: '100vh' }}>
            <Homepagenavbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#3c1300' }}>
                    My Active Orders
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {orders.length === 0 && !loading ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <ShoppingBag sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
                            No active orders
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, color: '#999' }}>
                            Start ordering delicious food from our menu!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/menu')}
                            sx={{
                                backgroundColor: '#06c167',
                                '&:hover': { backgroundColor: '#05a356' }
                            }}
                        >
                            Browse Menu
                        </Button>
                    </Paper>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Grid
                                container
                                spacing={3}
                                sx={{
                                    maxWidth: '1200px',
                                    justifyContent: orders.length < 3 ? 'center' : 'flex-start'
                                }}
                            >
                                {orders.map((order) => (
                                    <Grid item xs={12} sm={6} md={4} key={order._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Card
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                minHeight: 450,
                                                width: '100%',
                                                maxWidth: 350,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 20px rgba(0,0,0,0.15)' }
                                            }}
                                        >
                                            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexDirection: 'column', gap: 1 }}>
                                                    <Box sx={{ width: '100%' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.1rem' }}>
                                                            Order #{order._id.slice(-8).toUpperCase()}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {formatDate(order.createdAt)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Chip
                                                            icon={getStatusIcon(order.status)}
                                                            label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            color={getStatusColor(order.status)}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    </Box>
                                                </Box>

                                                <Box sx={{ mb: 2, flexGrow: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Customer: {order.customerName}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Phone: {order.customerPhone}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Type: {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Items: {order.items.length}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Payment: {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#06c167', mt: 1 }}>Total: LKR {order.grandTotal.toLocaleString()}</Typography>
                                                </Box>

                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Items:</Typography>
                                                    <Grid container spacing={1}>
                                                        {order.items.slice(0, 3).map((item, index) => (
                                                            <Grid item xs={4} key={index}>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100px' }}>
                                                                    <CardMedia
                                                                        component="img"
                                                                        image={item.image || '/placeholder-food.jpg'}
                                                                        alt={item.name}
                                                                        sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1, mb: 1 }}
                                                                    />
                                                                    <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                                        {item.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>Qty: {item.quantity}</Typography>
                                                                </Box>
                                                            </Grid>
                                                        ))}
                                                        {order.items.length > 3 && (
                                                            <Grid item xs={12}>
                                                                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                                                                    +{order.items.length - 3} more items
                                                                </Typography>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                </Box>

                                                <Divider sx={{ my: 2 }} />

                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexDirection: 'column' }}>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<Visibility />}
                                                        onClick={() => handleViewOrder(order)}
                                                        fullWidth
                                                        size="small"
                                                        sx={{ mb: 1 }}
                                                    >
                                                        {order.status === 'confirmed' ? 'View Receipt' : 'View Details'}
                                                    </Button>
                                                    {['pending'].includes(order.status) && (
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            startIcon={<Cancel />}
                                                            onClick={() => handleCancelOrder(order)}
                                                            disabled={cancellingOrder === order._id}
                                                            fullWidth
                                                            size="small"
                                                        >
                                                            {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel Order'}
                                                        </Button>
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={(e, value) => setPage(value)}
                                    color="primary"
                                    size="large"
                                />
                            </Box>
                        )}
                    </>
                )}

                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                    {selectedOrder && (
                        <>
                            <DialogTitle>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6">Order #{selectedOrder._id.slice(-8).toUpperCase()}</Typography>
                                    <Chip
                                        icon={getStatusIcon(selectedOrder.status)}
                                        label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                        color={getStatusColor(selectedOrder.status)}
                                    />
                                </Box>
                            </DialogTitle>
                            <DialogContent>
                                {selectedOrder.status === 'confirmed' && (
                                    <Alert severity="success" sx={{ mb: 2 }}>Your order has been confirmed by admin!</Alert>
                                )}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Order Information</Typography>
                                        <Typography variant="body2" color="text.secondary">Order Date: {formatDate(selectedOrder.createdAt)}</Typography>
                                        <Typography variant="body2" color="text.secondary">Order Type: {selectedOrder.orderType.charAt(0).toUpperCase() + selectedOrder.orderType.slice(1)}</Typography>
                                        <Typography variant="body2" color="text.secondary">Payment Method: {selectedOrder.paymentMethod.charAt(0).toUpperCase() + selectedOrder.paymentMethod.slice(1)}</Typography>
                                        <Typography variant="body2" color="text.secondary">Payment Status: {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}</Typography>

                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>Customer Details</Typography>
                                        <Typography variant="body2" color="text.secondary">Name: {selectedOrder.customerName}</Typography>
                                        <Typography variant="body2" color="text.secondary">Phone: {selectedOrder.customerPhone}</Typography>
                                        {selectedOrder.orderType === 'delivery' && selectedOrder.address && (
                                            <Typography variant="body2" color="text.secondary">Address: {selectedOrder.address}</Typography>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Order Items</Typography>
                                        <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                                            {selectedOrder.items.map((item, index) => (
                                                <Card key={index} sx={{ mb: 2 }}>
                                                    <CardContent sx={{ p: 2 }}>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={4}>
                                                                <CardMedia
                                                                    component="img"
                                                                    image={item.image || '/placeholder-food.jpg'}
                                                                    alt={item.name}
                                                                    sx={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 1 }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={8}>
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>{item.name}</Typography>
                                                                {item.selectedPortion?.label !== 'Standard' && (
                                                                    <Chip label={item.selectedPortion.label} size="small" sx={{ mb: 1, backgroundColor: '#f0f0f0' }} />
                                                                )}
                                                                <Typography variant="body2" color="text.secondary">Qty: {item.quantity} × LKR {item.price.toLocaleString()}</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#06c167' }}>LKR {item.totalPrice.toLocaleString()}</Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">Items Total</Typography>
                                                <Typography variant="body2">LKR {selectedOrder.totalAmount.toLocaleString()}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">Delivery Fee</Typography>
                                                <Typography variant="body2">LKR {selectedOrder.deliveryFee}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2">Service Charge</Typography>
                                                <Typography variant="body2">LKR {selectedOrder.serviceCharge}</Typography>
                                            </Box>
                                            <Divider sx={{ my: 1 }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Grand Total</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#06c167' }}>LKR {selectedOrder.grandTotal.toLocaleString()}</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                {['pending'].includes(selectedOrder.status) && (
                                    <Button onClick={() => handleCancelOrder(selectedOrder)} color="error" disabled={cancellingOrder === selectedOrder._id}>
                                        {cancellingOrder === selectedOrder._id ? 'Cancelling...' : 'Cancel Order'}
                                    </Button>
                                )}
                                <Button onClick={() => setDialogOpen(false)}>Close</Button>
                            </DialogActions>
                        </>
                    )}
                </Dialog>
            </Container>
        </Box>
    );
};

export default MyOrdersPage;
