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
import Footer from "../Components/Home/Footer";

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
        if (items.length === 0) {
            navigate('/menu');
        }
    }, [items, navigate]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.customerName.trim()) { setError('Full name is required'); return; }
        if (!formData.customerPhone.trim()) { setError('Telephone number is required'); return; }
        if (!formData.address.trim()) { setError('Address is required'); return; }

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

    const grandTotal = totalAmount;

    if (items.length === 0) return null;

    return (
        <>
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#FFF3E8',
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <HomepageNavbar />
            <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#2c1000', mb: 1 }}>
                        Complete Your Order
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#2c1000', fontWeight: 400 }}>
                        Review your items and provide details
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }} onClose={() => setError('')}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 1 }}>{success}</Alert>}

                <Box sx={{
                    maxWidth: '1200px',
                    width: '100%',
                    display: 'flex',
                    gap: 4,
                    '@media (max-width: 768px)': { flexDirection: 'column' }
                }}>
                    {/* Order Summary */}
                    <Box sx={{ flex: 1 }}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 1, backgroundColor: '#fff', border: '1px solid #e8d5c4', height: 'fit-content', position: 'sticky', top: 20 }}>
                            <Typography variant="h5" sx={{ mb: 3, color: '#2c1000', fontWeight: 600, textAlign: 'center' }}>
                                Order Summary
                            </Typography>

                            <Box sx={{ mb: 3, maxHeight: '400px', overflowY: 'auto' }}>
                                <Stack spacing={2}>
                                    {items.map((item, index) => (
                                        <Card key={index} elevation={0} sx={{ borderRadius: 1, border: '1px solid #e8d5c4' }}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                    <CardMedia component="img" image={item.image || '/placeholder-food.jpg'} alt={item.name} sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }} />
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#2c1000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {item.name}
                                                        </Typography>
                                                        {item.selectedPortion.label !== 'Standard' && (
                                                            <Chip label={item.selectedPortion.label} size="small" sx={{ mb: 0.5, backgroundColor: '#e8d5c4', color: '#2c1000', fontWeight: 500, height: 20, fontSize: '0.7rem' }} />
                                                        )}
                                                        <Typography variant="caption" sx={{ display: 'block' }}>Qty: {item.quantity} × LKR {item.price.toLocaleString()}</Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#fda021' }}>LKR {item.totalPrice.toLocaleString()}</Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </Box>

                            <Divider sx={{ my: 3 }} />
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#2c1000' }}>Items ({items.length})</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>LKR {totalAmount.toLocaleString()}</Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 3 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, backgroundColor: '#e8d5c45e', borderRadius: 1, border: '1px solid #2c1000' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c1000' }}>Total</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#fda021' }}>LKR {grandTotal.toLocaleString()}</Typography>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Customer Info */}
                    <Box sx={{ flex: 2 }}>
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 1, backgroundColor: '#fff', border: '1px solid #e8d5c4', height: 'fit-content' }}>
                            <Typography variant="h5" sx={{ mb: 4, color: '#2c1000', fontWeight: 600, textAlign: 'center' }}>
                                Your Information
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <Stack spacing={4}>
                                    <TextField
                                        fullWidth label="Full Name" value={formData.customerName}
                                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                                        required variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: 1, backgroundColor: '#fff', '&:hover fieldset': { borderColor: '#fda021' }, '&.Mui-focused fieldset': { borderColor: '#fda021', borderWidth: 1 } },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#fda021' }
                                        }}
                                    />
                                    <TextField
                                        fullWidth label="Telephone Number" value={formData.customerPhone}
                                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                        required variant="outlined" placeholder="0771234567"
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: 1, backgroundColor: '#fff', '&:hover fieldset': { borderColor: '#fda021' }, '&.Mui-focused fieldset': { borderColor: '#fda021', borderWidth: 1 } },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#fda021' }
                                        }}
                                    />
                                    <TextField
                                        fullWidth label="Address" value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        required multiline rows={4} variant="outlined"
                                        placeholder="Enter your complete address"
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: 1, backgroundColor: '#fff', '&:hover fieldset': { borderColor: '#fda021' }, '&.Mui-focused fieldset': { borderColor: '#fda021', borderWidth: 1 } },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#fda021' }
                                        }}
                                    />

                                    <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
                                        sx={{
                                            backgroundColor: '#fda021',
                                            '&:hover': { backgroundColor: '#e8d5c4', color: '#2c1000' },
                                            py: 2.5, fontSize: '1.2rem', fontWeight: 600, borderRadius: 1, textTransform: 'none'
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
        <Footer />
    </>
    );
};

export default CheckoutPage;
