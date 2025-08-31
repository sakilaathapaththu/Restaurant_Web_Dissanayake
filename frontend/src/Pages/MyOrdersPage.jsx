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
  Pagination
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
import jsPDF from 'jspdf';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);
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

  const handleCancelOrder = async (order) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancellingOrder(order._id);
      const guestUserId = cartService.generateGuestUserId();
      await orderService.cancelOrder(order._id, guestUserId);
      await loadOrders();
      if (expandedOrder?._id === order._id) setExpandedOrder(null);
    } catch (error) {
      alert(error.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(null);
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

  //pdf invoice generation
const handleGenerateInvoice = async (order) => {
  const doc = new jsPDF();

  // Header Section
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("✅ Your order has been confirmed", 20, 20);

  // Order Info Box
  doc.setFillColor(230, 255, 237); // light green background
  doc.rect(15, 30, 180, 60, "F");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Order Info", 20, 40);
  doc.setFont("helvetica", "normal");
  doc.text(`Order Date: ${formatDate(order.createdAt)}`, 20, 48);
  doc.text(`Payment Method: ${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}`, 20, 56);

  doc.setFont("helvetica", "bold");
  doc.text("Customer Details", 20, 70);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${order.customerName}`, 20, 78);
  doc.text(`Phone: ${order.customerPhone}`, 20, 86);
  if (order.orderType === "delivery" && order.address) {
    doc.text(`Address: ${order.address}`, 20, 94);
  }

  // Order Items
  let startY = 110;
  doc.setFont("helvetica", "bold");
  doc.text("Order Items", 20, startY);

  startY += 10;

  // Draw each item with image + details
  for (const item of order.items) {
    try {
      if (item.image) {
        const imgData = await getBase64Image(item.image); // helper to convert image to base64
        doc.addImage(imgData, "JPEG", 20, startY, 25, 25);
      }
    } catch (err) {
      console.log("Image load failed", err);
    }

    doc.setFont("helvetica", "bold");
    doc.text(item.name, 50, startY + 6);
    doc.setFont("helvetica", "normal");
    doc.text(`Qty: ${item.quantity} × LKR ${item.price.toLocaleString()}`, 50, startY + 14);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(253, 160, 33); // orange
    doc.text(`LKR ${item.totalPrice.toLocaleString()}`, 190, startY + 14, { align: "right" });
    doc.setTextColor(0, 0, 0);

    startY += 35;
  }

  // Totals
  startY += 5;
  doc.setLineWidth(0.5);
  doc.line(20, startY, 190, startY);

  startY += 10;
  doc.setFont("helvetica", "normal");
  doc.text("Items Total:", 130, startY);
  doc.text(`LKR ${order.totalAmount.toLocaleString()}`, 190, startY, { align: "right" });

  if (order.serviceCharge) {
    startY += 8;
    doc.text("Service Charge:", 130, startY);
    doc.text(`LKR ${order.serviceCharge.toLocaleString()}`, 190, startY, { align: "right" });
  }

  startY += 10;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(253, 160, 33); // orange for total
  doc.text("Total:", 130, startY);
  doc.text(`LKR ${order.grandTotal.toLocaleString()}`, 190, startY, { align: "right" });
  doc.setTextColor(0, 0, 0);

  // Footer
  startY += 20;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.text("Thank you for your order!", 105, startY, { align: "center" });

  // Save
  doc.save(`Invoice_${order._id}.pdf`);
};

// Helper: convert image URL to base64 for jsPDF
const getBase64Image = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = reject;
    img.src = url;
  });
};

//pdf invoice generation----------------------------------------------------------------------------




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
              sx={{ backgroundColor: '#06c167', '&:hover': { backgroundColor: '#fda021' } }}
            >
              Browse Menu
            </Button>
          </Paper>
        ) : (
          <>
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

                        {/* View Receipt */}
                        <Button
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewReceipt(order)}
                          sx={{ mt: 2 }}
                          fullWidth
                        >
                          {expandedOrder?._id === order._id ? 'Hide Receipt' : 'View Receipt'}
                        </Button>

                        {/* Generate Invoice Button BELOW View Receipt */}
                        {order.status === 'confirmed' && (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleGenerateInvoice(order)}
                            fullWidth
                            sx={{ mt: 1, backgroundColor: '#06c167', '&:hover': { backgroundColor: '#fda021' } }}
                          >
                            Generate Invoice
                          </Button>
                        )}

                        {/* Cancel Order Button */}
                        {['pending'].includes(order.status) && (
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => handleCancelOrder(order)}
                            disabled={cancellingOrder === order._id}
                            fullWidth
                            sx={{ mt: 1 }}
                          >
                            {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel Order'}
                          </Button>
                        )}

                        {/* Inline receipt box */}
                        {expandedOrder?._id === order._id && (
                          <Paper
                            sx={{
                              mt: 3,
                              p: 3,
                              borderRadius: 1,
                              backgroundColor:
                                order.status === 'pending' ? '#fffbe6' :
                                order.status === 'confirmed' ? '#e6ffed' :
                                'white',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                          >
                            {order.status === 'confirmed' && (
                              <Alert severity="success" sx={{ mb: 2 }}>Your order has been confirmed</Alert>
                            )}
                            {order.status === 'pending' && (
                              <Alert severity="warning" sx={{ mb: 2 }}>Your order is pending</Alert>
                            )}

                            <Grid container spacing={2}>
                              {/* Left Column: Order Info & Customer Details */}
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

                              {/* Right Column: Order Items */}
                              
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'flex-start' }}>Order Items</Typography>
                                <Box sx={{ maxHeight: 250, overflowY: 'auto', pr: 1 }}>
                                  {order.items.map((item, i) => (
                                    <Card key={i} sx={{ mb: 1 }}>
                                      <CardContent sx={{ p: 1 }}>
                                        <Grid container spacing={9} alignItems="center">
                                          <Grid item xs={4}>
                                            <CardMedia
                                              component="img"
                                              image={item.image || '/placeholder-food.jpg'}
                                              alt={item.name}
                                              sx={{ width: '100%', height: 50, objectFit: 'cover', borderRadius: 1 }}
                                            />
                                          </Grid>
                                          <Grid item xs={8}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'right' }}>{item.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                                              Qty: {item.quantity} × LKR {item.price.toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fda021', textAlign: 'right' }}>
                                              LKR {item.totalPrice.toLocaleString()}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </CardContent>
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

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} color="primary" size="large" />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default MyOrdersPage;
