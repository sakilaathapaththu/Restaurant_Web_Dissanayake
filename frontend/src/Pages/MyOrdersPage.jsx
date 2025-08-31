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
  Divider,
  CardMedia,
  Pagination,
  Stack
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  ShoppingBag,
  LocalShipping,
  Error,
  ForkLeft
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import cartService from '../services/cartService';
import Homepagenavbar from '../Components/Navbar/Homepagenavbar';
import Logo from '../Asset/images/mobile logo.png';
import jsPDF from 'jspdf';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const guestUserId = cartService.generateGuestUserId();
      const response = await orderService.getOrdersByUser(guestUserId, { page, limit: 10 });

      if (response.success) {
        const filteredOrders = response.data.filter(order =>
          !['cancelled'].includes(order.status)
        );
        setOrders(filteredOrders);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      setError(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = (order) => {
    setExpandedOrder(expandedOrder?._id === order._id ? null : order);
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

  const getStatusColor = (status) => {
    switch (status) {
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
      case 'confirmed': return <CheckCircle />;
      case 'preparing': return <ShoppingBag />;
      case 'ready': return <LocalShipping />;
      case 'delivered': return <CheckCircle />;
      case 'cancelled': return <Error />;
      default: return <CheckCircle />;
    }
  };

  // PDF generation code here (unchanged)
  const handleGenerateInvoice = async (order) => {
    // your existing PDF code...
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
            <Button
              variant="contained"
              onClick={() => navigate('/menu')}
              sx={{ backgroundColor: '#fda021', '&:hover': { backgroundColor: '#fda021' } }}
            >
              Browse Menu
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Grid container spacing={3} sx={{ maxWidth: '1400px', justifyContent: orders.length < 3 ? 'center' : 'flex-start' }}>
              {orders.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 180, width: 350 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">Order #{order._id.slice(-8).toUpperCase()}</Typography>
                        <Chip icon={getStatusIcon(order.status)} label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} color={getStatusColor(order.status)} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">{formatDate(order.createdAt)}</Typography>

                      <Button
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => handleViewReceipt(order)}
                        sx={{ mt: 2 }}
                        fullWidth
                      >
                        {expandedOrder?._id === order._id ? 'Hide Receipt' : 'View Receipt'}
                      </Button>

                      {order.status && (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleGenerateInvoice(order)}
                          fullWidth
                          sx={{ mt: 1, backgroundColor: '#fda021', '&:hover': { backgroundColor: '#e38f1bff' } }}
                        >
                          Generate Invoice
                        </Button>
                      )}

                      {expandedOrder?._id === order._id && (
                        <Paper sx={{ mt: 3, p: 3, borderRadius: 1, backgroundColor: 'white', width: '100%', boxSizing: 'border-box' }}>
                          <Grid container spacing={2}>
                            {/* Left Column */}
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Order Info</Typography>
                              <Typography variant="body2" color="text.secondary">Order Date: {formatDate(order.createdAt)}</Typography>
                              <Typography variant="body2" color="text.secondary">Payment Method: {order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}</Typography>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>Customer Details</Typography>
                              <Typography variant="body2" color="text.secondary">Name: {order.customerName}</Typography>
                              <Typography variant="body2" color="text.secondary">Phone: {order.customerPhone}</Typography>
                              {order.orderType === 'delivery' && order.address && (
                                <Typography variant="body2" color="text.secondary">Address: {order.address}</Typography>
                              )}
                            </Grid>

                            {/* Right Column: Uniform Order Items */}
                            <Grid item xs={12} md={6}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Order Items</Typography>
                              <Box sx={{ maxHeight: 250, overflowY: 'auto', pr: 1 }}>
                                {order.items.map((item, i) => (
                                  <Card key={i} sx={{ mb: 1, minHeight: 80, display: 'flex', alignItems: 'center', px: 1, py: 1 }}>
                                    <CardMedia 
                                        component="img"
                                        image={item.image || '/placeholder-food.jpg'}
                                        alt={item.name}
                                        sx={{ width: 50, height: 60, objectFit: 'cover', borderRadius: 1 }}
                                      />

                                    <Stack spacing={0.3} sx={{ ml: 11, flex: 1 }}>
                                      <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        Qty: {item.quantity} × LKR {item.price.toLocaleString()}
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fda021', textAlign: 'right' }}>
                                        LKR {item.totalPrice.toLocaleString()}
                                      </Typography>
                                    </Stack>
                                  </Card>
                                ))}
                              </Box>

                              <Divider sx={{ my: 1 }} />
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2">Items Total</Typography>
                                <Typography variant="body2" sx={{ textAlign: 'right' }}>LKR {order.totalAmount.toLocaleString()}</Typography>
                              </Box>
                              {order.serviceCharge && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2">Service Charge</Typography>
                                  <Typography variant="body2" sx={{ textAlign: 'right' }}>LKR {order.serviceCharge.toLocaleString()}</Typography>
                                </Box>
                              )}
                              <Divider sx={{ my: 1 }} />
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fda021', textAlign: 'right' }}>
                                  LKR {order.grandTotal.toLocaleString()}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={() => setExpandedOrder(null)}>Close</Button>
                          </Box>
                        </Paper>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="primary" size="large" />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MyOrdersPage;
