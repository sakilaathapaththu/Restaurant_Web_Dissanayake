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
// PDF invoice generation
const handleGenerateInvoice = async (order) => {
  const doc = new jsPDF('p', 'pt', 'a4'); // Portrait, points, A4
  const pageWidth = doc.internal.pageSize.getWidth();
  let startY = 40;

  // Add Restaurant Logo - left
  try {
    const logoBase64 = await getBase64Image(Logo); // your imported logo
    doc.addImage(logoBase64, 'PNG', 20, 40, 160, 40); // width & height
  } catch (err) {
    console.log("Logo load failed", err);
  }

  
  const orderId = order._id.slice(-8).toUpperCase();
  // Contact Info - right aligned
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Contact No: 0777506319", pageWidth - 20, startY, { align: "right" });
  doc.text("Email: Dissanayakesuper20@gmail.com", pageWidth - 20, startY + 15, { align: "right" });
  doc.text("Address: No.20, Colombo Rd, Pothuhera", pageWidth - 20, startY + 30, { align: "right" });

  startY += 70;

  // Draw horizontal line
  doc.setLineWidth(0.5);
  doc.line(20, startY, pageWidth - 20, startY);
  startY += 40;

  // Order Info & Customer Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Order Info:", 20, startY);startY += 5;
  doc.setFont("helvetica", "normal");
    doc.text(`Order ID: ${orderId}`, 20, startY + 15);
  doc.text(`Order Date: ${formatDate(order.createdAt)}`, 20, startY + 30);
  doc.text(`Payment Method: ${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}`, 20, startY + 45);

  doc.setFont("helvetica", "bold");
  doc.text("Customer Details:", pageWidth - 20, startY, { align: "right" });startY += 5;
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${order.customerName}`, pageWidth - 20, startY + 15, { align: "right" });
  doc.text(`Phone: ${order.customerPhone}`, pageWidth - 20, startY + 30, { align: "right" });
  if (order.orderType === "delivery" && order.address) {
    doc.text(`Address: ${order.address}`, pageWidth - 20, startY + 45, { align: "right" });
  }
  startY += 80;

  // Draw Order Items Table Header
  doc.setFont("helvetica", "bold");
  doc.text("Item", 20, startY);
  doc.text("Qty", pageWidth / 2 - 20, startY);
  doc.text("Price", pageWidth / 2 + 50, startY);
  doc.text("Total", pageWidth - 30, startY, { align: "right" });
  startY += 10;

  doc.setLineWidth(0.3);
  doc.line(20, startY, pageWidth - 20, startY);
  startY += 10;

  // Order Items
  doc.setFont("helvetica", "normal");
  for (const item of order.items) {
    if (item.image) {
      try {
        const imgData = await getBase64Image(item.image);
        doc.addImage(imgData, "JPEG", 20, startY - 5, 30, 30);
      } catch (err) {
        console.log("Item image failed", err);
      }
    }

    doc.text(item.name, 60, startY + 10);
    doc.text(`${item.quantity}`, pageWidth / 2 - 20, startY + 10);
    doc.text(`LKR ${item.price.toLocaleString()}`, pageWidth / 2 + 50, startY + 10);
    doc.setFont("helvetica", "bold");
    doc.text(`LKR ${item.totalPrice.toLocaleString()}`, pageWidth - 30, startY + 10, { align: "right" });
    doc.setFont("helvetica", "normal");

    startY += 35;

    if (startY > doc.internal.pageSize.getHeight() - 100) {
      doc.addPage();
      startY = 40;
    }
  }

  // Totals
  doc.setLineWidth(0.5);
  doc.line(20, startY, pageWidth - 20, startY);
  startY += 25;

  doc.setFont("helvetica", "normal");
  doc.text("Items Total:", pageWidth - 100, startY, { align: "right" });
  doc.text(`LKR ${order.totalAmount.toLocaleString()}`, pageWidth - 30, startY, { align: "right" });

  if (order.serviceCharge) {
    startY += 17;
    doc.text("Service Charge:", pageWidth - 100, startY, { align: "right" });
    doc.text(`LKR ${order.serviceCharge.toLocaleString()}`, pageWidth - 30, startY, { align: "right" });
  }

  startY += 17;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(253, 160, 33);
  doc.text("Total:", pageWidth - 100, startY, { align: "right" });
  doc.text(`LKR ${order.grandTotal.toLocaleString()}`, pageWidth - 30, startY, { align: "right" });
  doc.setTextColor(0, 0, 0);

  // Footer
startY += 60;
doc.setFont("helvetica", "italic");
doc.setFontSize(11);
doc.text("We appreciate your business and hope you enjoy your order!", pageWidth / 2, startY, { align: "center" });


  // Save PDF using real order ID
  doc.save(`Invoice_${orderId}.pdf`);
};

// Helper: Convert image URL to Base64
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
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
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
