import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardMedia,
    Box,
    Divider,
    Alert,
    CircularProgress,
    Chip,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import cartService from '../services/cartService';
import HomepageNavbar from '../Components/Navbar/Homepagenavbar';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, totalAmount, clearCartLocally } = useCart();

    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        address: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (items.length === 0) navigate('/menu');
    }, [items, navigate]);

    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.customerName.trim()) return setError('Full name is required');
        if (!formData.customerPhone.trim()) return setError('Telephone number is required');
        if (!formData.address.trim()) return setError('Address is required');

        setLoading(true);
        setError('');

        try {
            const guestUserId = cartService.generateGuestUserId();
            const orderData = { userId: guestUserId, ...formData };
            const response = await orderService.createOrder(orderData);

            if (response.success) {
                setSuccess('Order placed successfully!');
                clearCartLocally();
                setTimeout(() => navigate('/my-orders'), 2000);
            }
        } catch (err) {
            setError(err.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const deliveryFee = 200;
    const serviceCharge = 50;
    const grandTotal = totalAmount + deliveryFee + serviceCharge;

    if (items.length === 0) return null;

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#FFF5EE', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <HomepageNavbar />
            <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4, px: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c1000', mb: 1 }}>Complete Your Order</Typography>
                    <Typography variant="body1" sx={{ color: '#6e5843' }}>Review your items and provide details</Typography>
                </Box>

                {error && (
                    <Alert severity="error" onClose={() => setError('')} sx={{ mb: 3, borderRadius: 1, width: '100%', maxWidth: 600 }}>{error}</Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 1, width: '100%', maxWidth: 600 }}>{success}</Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%', maxWidth: 1200 }}>
                    {/* Order Summary */}
                    <Box sx={{ flex: 1 }}>
                        <Paper sx={{ p: 3, borderRadius: 1, backgroundColor: '#ffffffff', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', position: { md: 'sticky' }, top: { md: 20 } }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c1000', textAlign: 'center' }}>Order Summary</Typography>

                            <Stack spacing={2} sx={{ maxHeight: 400, overflowY: 'auto', mb: 3 }}>
                                {items.map((item, index) => (
                                    <Card key={index} sx={{ display: 'flex', alignItems: 'center', p: 1.5, borderRadius: 1, boxShadow: '0 3px 12px rgba(0,0,0,0.05)', transition: '0.3s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' } }}>
                                        <CardMedia component="img" image={item.image || '/placeholder-food.jpg'} alt={item.name} sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }} />
                                        <Box sx={{ flex: 1, ml: 2 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2c1000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</Typography>
                                            {item.selectedPortion?.label && item.selectedPortion.label !== 'Standard' && (
                                                <Chip label={item.selectedPortion.label} size="small" sx={{ mt: 0.5, backgroundColor: '#fda021', color: '#fff', fontWeight: 500, height: 20, fontSize: '0.7rem' }} />
                                            )}
                                            <Typography variant="caption" sx={{ display: 'block', color: '#ffffffff' }}>Qty: {item.quantity} × LKR {item.price.toLocaleString()}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fda021' }}>LKR {item.totalPrice.toLocaleString()}</Typography>
                                        </Box>
                                    </Card>
                                ))}
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            <Stack spacing={1}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#6e5843' }}>Items ({items.length})<span>LKR {totalAmount.toLocaleString()}</span></Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#6e5843' }}>Delivery Fee<span>LKR {deliveryFee.toLocaleString()}</span></Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#6e5843' }}>Service Charge<span>LKR {serviceCharge.toLocaleString()}</span></Box>
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, backgroundColor: '#e8d5c433', borderRadius: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2c1000' }}>Total</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fda021' }}>LKR {grandTotal.toLocaleString()}</Typography>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Information Form */}
                    <Box sx={{ flex: 2 }}>
                        <Paper sx={{ p: 3, borderRadius: 1, backgroundColor: '#ffffffff', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2c1000', textAlign: 'center' }}>Your Information</Typography>

                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    {['customerName', 'customerPhone', 'address'].map((field) => (
                                        <TextField
                                            key={field}
                                            fullWidth
                                            label={field === 'customerName' ? 'Full Name' : field === 'customerPhone' ? 'Telephone Number' : 'Address'}
                                            value={formData[field]}
                                            onChange={(e) => handleInputChange(field, e.target.value)}
                                            required
                                            multiline={field === 'address'}
                                            rows={field === 'address' ? 4 : 1}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1,
                                                    backgroundColor: '#f8f9fa',
                                                    '&:hover fieldset': { borderColor: '#fda021' },
                                                    '&.Mui-focused fieldset': { borderColor: '#fda021', borderWidth: 2 },
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': { color: '#fda021' },
                                            }}
                                        />
                                    ))}

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                        sx={{
                                            backgroundColor: '#fda021',
                                            '&:hover': { backgroundColor: '#e8d5c4', color: '#2c1000', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' },
                                            py: 1.5,
                                            fontWeight: 700,
                                            borderRadius: 1,
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            transition: '0.3s'
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : `Place Order • LKR ${grandTotal.toLocaleString()}`}
                                    </Button>
                                </Stack>
                            </form>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CheckoutPage;
