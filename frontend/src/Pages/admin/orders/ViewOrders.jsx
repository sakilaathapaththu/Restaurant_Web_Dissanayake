
import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, Card, CardContent, Grid, Box, Chip, Button, CircularProgress,
  Alert, Pagination, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  ButtonGroup, CardMedia, TextField
} from '@mui/material';
import ResponsiveLayout from '../../../Components/Dashboard/ResponsiveLayout';
import { Visibility, CheckCircle, Schedule, Error, FilterList, Refresh, Clear } from '@mui/icons-material';
import orderService from '../../../services/orderService';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');

  // Stats
  const [stats, setStats] = useState(null);

  // 👇 NEW: local pickup time per order id
  const [pickupTimes, setPickupTimes] = useState({});
  const onTimeChange = (id, v) => setPickupTimes(p => ({ ...p, [id]: v }));

  useEffect(() => {
    loadOrders();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const response = await orderService.getAllOrders(params);
      if (response.success) {
        setOrders(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalOrders(response.pagination.totalOrders);
      }
    } catch (e) {
      setError(e.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await orderService.getOrderStats();
      if (response.success) setStats(response.data);
    } catch (e) {
      console.error('Failed to load stats:', e);
    }
  };

  const handleViewOrder = (order) => { setSelectedOrder(order); setDialogOpen(true); };

  // ✅ require time + send with update
  const handleConfirmWithTime = async (order) => {
    const t = pickupTimes[order._id];
    if (!t) return alert('Please set a pickup time before confirming this order.');
    try {
      setUpdatingOrder(order._id);
      await orderService.updateOrderStatus(order._id, { status: 'confirmed', pickupTime: t });
      await loadOrders(); await loadStats();
      if (selectedOrder?._id === order._id) { setDialogOpen(false); setSelectedOrder(null); }
    } catch (e) {
      alert(e.message || 'Failed to confirm order');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleCancel = async (order) => {
    try {
      setUpdatingOrder(order._id);
      await orderService.updateOrderStatus(order._id, { status: 'cancelled' });
      await loadOrders(); await loadStats();
      if (selectedOrder?._id === order._id) { setDialogOpen(false); setSelectedOrder(null); }
    } catch (e) {
      alert(e.message || 'Failed to cancel order');
    } finally {
      setUpdatingOrder(null);
    }
  };

const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            setUpdatingOrder(orderId);
            await orderService.updateOrderStatus(orderId, { status: newStatus });

            // Reload orders and stats
            await loadOrders();
            await loadStats();

            // Close dialog if open
            if (selectedOrder?._id === orderId) {
                setDialogOpen(false);
                setSelectedOrder(null);
            }
        } catch (error) {
            alert(error.message || 'Failed to update order status');
        } finally {
            setUpdatingOrder(null);
        }
    };



  const getStatusColor = (s) => (s === 'pending' ? 'warning' : s === 'confirmed' ? 'success' : s === 'cancelled' ? 'error' : 'default');
  const getStatusIcon  = (s) => (s === 'pending' ? <Schedule/> : s === 'confirmed' ? <CheckCircle/> : s === 'cancelled' ? <Error/> : <Schedule/>);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const clearFilters = () => { setStatusFilter(''); setPage(1); };
  const handleStatusFilterChange = (s) => { setStatusFilter(s === statusFilter ? '' : s); setPage(1); };

  if (loading && orders.length === 0) {
    return (
      <ResponsiveLayout title="Order Management">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout title="Order Management">
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#3c1300' }}>Order Management</Typography>

      {/* Stats */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
              <Typography variant="h4" sx={{ color: '#1976d2', mb: 1 }}>{stats.totalOrders}</Typography>
              <Typography variant="body2" color="text.secondary">Total Orders</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
              <Typography variant="h4" sx={{ color: '#2e7d32', mb: 1 }}>{stats.todayOrders}</Typography>
              <Typography variant="body2" color="text.secondary">Today's Orders</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff3e0' }}>
              <Typography variant="h4" sx={{ color: '#f57c00', mb: 1 }}>{stats.weekOrders}</Typography>
              <Typography variant="body2" color="text.secondary">This Week</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#fce4ec' }}>
              <Typography variant="h4" sx={{ color: '#c2185b', mb: 1 }}>LKR {stats.totalRevenue?.toLocaleString() || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Filter (unchanged) */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ p: 1, borderRadius: '50%', backgroundColor: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FilterList sx={{ color: 'white', fontSize: '1.2rem' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg,#1976d2,#42a5f5)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Filter by Status
          </Typography>
        </Box>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#555', mr: 1 }}>Show orders:</Typography>
              <ButtonGroup variant="outlined" sx={{ flexWrap: 'wrap' }}>
                <Button onClick={() => handleStatusFilterChange('')} variant={statusFilter === '' ? 'contained' : 'outlined'}>All Orders</Button>
                <Button onClick={() => handleStatusFilterChange('pending')} variant={statusFilter === 'pending' ? 'contained' : 'outlined'} startIcon={<Schedule/>}>Pending</Button>
                <Button onClick={() => handleStatusFilterChange('confirmed')} variant={statusFilter === 'confirmed' ? 'contained' : 'outlined'} startIcon={<CheckCircle/>}>Confirmed</Button>
                <Button onClick={() => handleStatusFilterChange('cancelled')} variant={statusFilter === 'cancelled' ? 'contained' : 'outlined'} startIcon={<Error/>}>Cancelled</Button>
              </ButtonGroup>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              {statusFilter && <Button variant="outlined" onClick={() => { setStatusFilter(''); setPage(1); }} startIcon={<Clear/>}>Clear Filter</Button>}
              <Button variant="outlined" onClick={() => { loadOrders(); loadStats(); }} startIcon={<Refresh/>}>Refresh</Button>
            </Box>
          </Grid>
        </Grid>

        {statusFilter && (
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 'medium' }}>Currently showing:</Typography>
              <Chip icon={getStatusIcon(statusFilter)} label={`${statusFilter[0].toUpperCase()+statusFilter.slice(1)} Orders`} color={getStatusColor(statusFilter)} />
              <Typography variant="body2" sx={{ color: '#888' }}>({totalOrders} {totalOrders === 1 ? 'order' : 'orders'} found)</Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Orders */}
      {orders.length === 0 && !loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>No orders found</Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            {statusFilter ? 'Try adjusting your filter or check other status categories' : 'No orders have been placed yet'}
          </Typography>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Grid container spacing={3} sx={{ maxWidth: '1200px', justifyContent: orders.length < 3 ? 'center' : 'flex-start' }}>
              {orders.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order._id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 500, width: '100%', maxWidth: 350 }}>
                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.1rem' }}>
                            Order #{order._id.slice(-8).toUpperCase()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">{formatDate(order.createdAt)}</Typography>
                        </Box>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          {pickupTimes[order._id] && <Chip label={`Pickup ${pickupTimes[order._id]}`} size="small" variant="outlined" />}
                          <Chip icon={getStatusIcon(order.status)} label={order.status[0].toUpperCase()+order.status.slice(1)} color={getStatusColor(order.status)} variant="outlined" size="small" />
                        </Box>
                      </Box>

                      {/* Details */}
                      <Box sx={{ mb: 2, flexGrow: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Customer: {order.customerName}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Phone: {order.customerPhone}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Type: {order.orderType.charAt(0).toUpperCase()+order.orderType.slice(1)}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Items: {order.items.length}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Payment: {order.paymentMethod.charAt(0).toUpperCase()+order.paymentMethod.slice(1)}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#06c167', mt: 1 }}>Total: LKR {order.grandTotal.toLocaleString()}</Typography>
                      </Box>

                      {/* Items preview */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Items:</Typography>
                        <Grid container spacing={1}>
                          {order.items.slice(0, 3).map((item, index) => (
                            <Grid item xs={4} key={index}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100px' }}>
                                <CardMedia component="img" image={item.image || '/placeholder-food.jpg'} alt={item.name}
                                  sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1, mb: 1 }} />
                                <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem', lineHeight: 1.2,
                                  overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
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

                      {/* ACTIONS */}
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexDirection: 'column' }}>
                        {/* 🔹 Pickup time input right above Confirm for PENDING */}
                        {order.status === 'pending' && (
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}>Pickup Time</Typography>
                            <TextField
                              type="time"
                              size="small"
                              fullWidth
                              value={pickupTimes[order._id] || ''}
                              onChange={(e) => onTimeChange(order._id, e.target.value)}
                              inputProps={{ step: 300 }}
                            />
                          </Box>
                        )}

                        <Button
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewOrder(order)}
                          fullWidth
                          size="small"
                          sx={{ mb: 1 }}
                        >
                          View Details
                        </Button>

                        {order.status === 'pending' && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleConfirmWithTime(order)}
                              disabled={updatingOrder === order._id}
                              fullWidth
                              size="small"
                              sx={{ mb: 1 }}
                            >
                              {updatingOrder === order._id ? 'Updating...' : 'Confirm Order'}
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleCancel(order)}
                              disabled={updatingOrder === order._id}
                              fullWidth
                              size="small"
                            >
                              {updatingOrder === order._id ? 'Updating...' : 'Cancel Order'}
                            </Button>
                          </>
                        )}

                        {order.status === 'confirmed' && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleCancel(order)}
                            disabled={updatingOrder === order._id}
                            fullWidth
                            size="small"
                          >
                            {updatingOrder === order._id ? 'Updating...' : 'Cancel Order'}
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
              <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" size="large" />
            </Box>
          )}
        </>
      )}

      {/* (Dialog left as-is; you can add the same time field there if you like) */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Order #{selectedOrder._id.slice(-8).toUpperCase()}</Typography>
                <Chip icon={getStatusIcon(selectedOrder.status)} label={selectedOrder.status[0].toUpperCase()+selectedOrder.status.slice(1)} color={getStatusColor(selectedOrder.status)} />
              </Box>
            </DialogTitle>
            <DialogContent>{/* your existing details… */}</DialogContent>
            <DialogActions>
              {selectedOrder.status === 'pending' && (
                <>
                  <Button onClick={() => handleConfirmWithTime(selectedOrder)} color="success" variant="contained" disabled={updatingOrder === selectedOrder._id}>
                    {updatingOrder === selectedOrder._id ? 'Updating...' : 'Confirm Order'}
                  </Button>
                  <Button onClick={() => handleCancel(selectedOrder)} color="error" variant="outlined" disabled={updatingOrder === selectedOrder._id}>
                    {updatingOrder === selectedOrder._id ? 'Updating...' : 'Cancel Order'}
                  </Button>
                </>
              )}
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
       {/* Order Details Dialog - Same as MyOrdersPage */}
            <Dialog
                 open={dialogOpen}
                 onClose={() => setDialogOpen(false)}
                 maxWidth="md"
                fullWidth
             >
                 {selectedOrder && (
                     <>
                         <DialogTitle>
                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                 <Typography variant="h6">
                                     Order #{selectedOrder._id.slice(-8).toUpperCase()}
                                 </Typography>
                                 <Chip
                                     icon={getStatusIcon(selectedOrder.status)}
                                     label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                     color={getStatusColor(selectedOrder.status)}
                                 />
                             </Box>
                         </DialogTitle>
                         <DialogContent>
                             <Grid container spacing={3}>
                                 <Grid item xs={12} md={6}>
                                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                         Order Information
                                     </Typography>
                                     <Box sx={{ mb: 2 }}>
                                         <Typography variant="body2" color="text.secondary">
                                             Order Date: {formatDate(selectedOrder.createdAt)}
                                         </Typography>
                                         <Typography variant="body2" color="text.secondary">
                                             Order Type: {selectedOrder.orderType.charAt(0).toUpperCase() + selectedOrder.orderType.slice(1)}
                                         </Typography>
                                         <Typography variant="body2" color="text.secondary">
                                             Payment Method: {selectedOrder.paymentMethod.charAt(0).toUpperCase() + selectedOrder.paymentMethod.slice(1)}
                                         </Typography>
                                         <Typography variant="body2" color="text.secondary">
                                             Payment Status: {selectedOrder.paymentStatus?.charAt(0).toUpperCase() + selectedOrder.paymentStatus?.slice(1) || 'N/A'}
                                         </Typography>
                                     </Box>

                                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                         Customer Details
                                     </Typography>
                                     <Box sx={{ mb: 2 }}>
                                         <Typography variant="body2" color="text.secondary">
                                             Name: {selectedOrder.customerName}
                                         </Typography>
                                         <Typography variant="body2" color="text.secondary">
                                             Phone: {selectedOrder.customerPhone}
                                         </Typography>
                                         {selectedOrder.orderType === 'delivery' && selectedOrder.address && (
                                             <Typography variant="body2" color="text.secondary">
                                                 Address: {selectedOrder.address}
                                             </Typography>
                                         )}
                                     </Box>
                                 </Grid>

                                 <Grid item xs={12} md={6}>
                                     <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                         Order Items
                                     </Typography>
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
                                                                 sx={{
                                                                     width: '100%',
                                                                     height: 60,
                                                                     objectFit: 'cover',
                                                                     borderRadius: 1
                                                                 }}
                                                             />
                                                         </Grid>
                                                         <Grid item xs={8}>
                                                             <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                                 {item.name}
                                                             </Typography>
                                                             {item.selectedPortion?.label && item.selectedPortion.label !== 'Standard' && (
                                                                 <Chip
                                                                     label={item.selectedPortion.label}
                                                                     size="small"
                                                                     sx={{ mb: 1, backgroundColor: '#f0f0f0' }}
                                                                 />
                                                             )}
                                                             <Typography variant="body2" color="text.secondary">
                                                                 Qty: {item.quantity} × LKR {item.price.toLocaleString()}
                                                             </Typography>
                                                             <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#06c167' }}>
                                                                 LKR {(item.totalPrice || item.price * item.quantity).toLocaleString()}
                                                             </Typography>
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
                                             <Typography variant="body2">LKR {(selectedOrder.totalAmount || selectedOrder.grandTotal).toLocaleString()}</Typography>
                                         </Box>
                                         {selectedOrder.deliveryFee && (
                                             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                 <Typography variant="body2">Delivery Fee</Typography>
                                                 <Typography variant="body2">LKR {selectedOrder.deliveryFee}</Typography>
                                             </Box>
                                         )}
                                         {selectedOrder.serviceCharge && (
                                             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                 <Typography variant="body2">Service Charge</Typography>
                                                 <Typography variant="body2">LKR {selectedOrder.serviceCharge}</Typography>
                                             </Box>
                                         )}
                                         <Divider sx={{ my: 1 }} />
                                         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                 Grand Total
                                             </Typography>
                                             <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#06c167' }}>
                                                 LKR {selectedOrder.grandTotal.toLocaleString()}
                                             </Typography>
                                         </Box>
                                     </Box>
                                 </Grid>
                             </Grid>
                         </DialogContent>
                         <DialogActions>
                             {/* Admin Actions in Dialog */}
                             {selectedOrder.status === 'pending' && (
                                 <>
                                     <Button
                                         onClick={() => handleUpdateStatus(selectedOrder._id, 'confirmed')}
                                         color="success"
                                         variant="contained"
                                         disabled={updatingOrder === selectedOrder._id}
                                     >
                                         {updatingOrder === selectedOrder._id ? 'Updating...' : 'Confirm Order'}
                                     </Button>
                                     <Button
                                         onClick={() => handleUpdateStatus(selectedOrder._id, 'cancelled')}
                                         color="error"
                                         variant="outlined"
                                         disabled={updatingOrder === selectedOrder._id}
                                     >
                                         {updatingOrder === selectedOrder._id ? 'Updating...' : 'Cancel Order'}
                                     </Button>
                                 </>
                             )}
                             {selectedOrder.status === 'confirmed' && (
                                 <Button
                                     onClick={() => handleUpdateStatus(selectedOrder._id, 'cancelled')}
                                     color="error"
                                     variant="outlined"
                                     disabled={updatingOrder === selectedOrder._id}
                                 >
                                     {updatingOrder === selectedOrder._id ? 'Updating...' : 'Cancel Order'}
                                 </Button>
                             )}
                             <Button onClick={() => setDialogOpen(false)}>Close</Button>
                         </DialogActions>
                     </>
                 )}
             </Dialog>
    </ResponsiveLayout>
  );
};

export default ViewOrders;
