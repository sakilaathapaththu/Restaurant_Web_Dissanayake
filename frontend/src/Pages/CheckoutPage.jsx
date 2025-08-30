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
        // Redirect if cart is empty
        if (items.length === 0) {
            navigate('/menu');
        }
    }, [items, navigate]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.customerName.trim()) {
            setError('Full name is required');
            return;
        }

        if (!formData.customerPhone.trim()) {
            setError('Telephone number is required');
            return;
        }

        if (!formData.address.trim()) {
            setError('Address is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Generate guest user ID
            const guestUserId = cartService.generateGuestUserId();

            const orderData = {
                userId: guestUserId,
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                address: formData.address
            };

            const response = await orderService.createOrder(orderData);

            if (response.success) {
                setSuccess('Order placed successfully!');
                // Clear cart after successful order
                clearCartLocally();

                // Redirect to order confirmation after 2 seconds
                setTimeout(() => {
                    navigate('/my-orders');
                }, 2000);
            }
        } catch (error) {
            setError(error.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    const deliveryFee = 0;
    const serviceCharge = 0;
    const grandTotal = totalAmount + deliveryFee + serviceCharge;

    if (items.length === 0) {
        return null; // Will redirect
    }

    return (
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
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: '#2c3e50',
                            mb: 1,
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        Complete Your Order
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#7f8c8d',
                            fontWeight: 400
                        }}
                    >
                        Review your items and provide details
                    </Typography>
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(231, 76, 60, 0.15)',
                            maxWidth: '1200px',
                            width: '100%'
                        }}
                        onClose={() => setError('')}
                    >
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert
                        severity="success"
                        sx={{
                            mb: 3,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(39, 174, 96, 0.15)',
                            maxWidth: '1200px',
                            width: '100%'
                        }}
                    >
                        {success}
                    </Alert>
                )}

                {/* Main Content Container */}
                <Box
                    sx={{
                        maxWidth: '1200px',
                        width: '100%',
                        display: 'flex',
                        gap: 4,
                        '@media (max-width: 768px)': {
                            flexDirection: 'column'
                        }
                    }}
                >


                    {/* Order Summary Section - Flex 1 */}
                    <Box sx={{ flex: 1 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                height: 'fit-content',
                                borderRadius: 3,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                position: 'sticky',
                                top: 20
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 3,
                                    color: '#2c3e50',
                                    fontWeight: 600,
                                    textAlign: 'center'
                                }}
                            >
                                Order Summary
                            </Typography>

                            {/* Cart Items */}
                            <Box sx={{ mb: 3, maxHeight: '400px', overflowY: 'auto' }}>
                                <Stack spacing={2}>
                                    {items.map((item, index) => (
                                        <Card
                                            key={index}
                                            elevation={0}
                                            sx={{
                                                borderRadius: 2,
                                                border: '1px solid #e8f4f8',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)'
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                    <CardMedia
                                                        component="img"
                                                        image={item.image || '/placeholder-food.jpg'}
                                                        alt={item.name}
                                                        sx={{
                                                            width: 60,
                                                            height: 60,
                                                            objectFit: 'cover',
                                                            borderRadius: 2,
                                                            flexShrink: 0
                                                        }}
                                                    />
                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                mb: 0.5,
                                                                color: '#2c3e50',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Typography>
                                                        {item.selectedPortion.label !== 'Standard' && (
                                                            <Chip
                                                                label={item.selectedPortion.label}
                                                                size="small"
                                                                sx={{
                                                                    mb: 0.5,
                                                                    backgroundColor: '#e8f4f8',
                                                                    color: '#2c3e50',
                                                                    fontWeight: 500,
                                                                    height: 20,
                                                                    fontSize: '0.7rem'
                                                                }}
                                                            />
                                                        )}
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                            Qty: {item.quantity} × LKR {item.price.toLocaleString()}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: '#27ae60'
                                                            }}
                                                        >
                                                            LKR {item.totalPrice.toLocaleString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Stack>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Price Breakdown */}
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                        Items ({items.length})
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        LKR {totalAmount.toLocaleString()}
                                    </Typography>
                                </Box>
                                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                        Delivery Fee
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        LKR {deliveryFee.toLocaleString()}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                        Service Charge
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        LKR {serviceCharge.toLocaleString()}
                                    </Typography>
                                </Box> */}
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    p: 2,
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: 2,
                                    border: '2px solid #27ae60'
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#2c3e50'
                                    }}
                                >
                                    Total
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#27ae60'
                                    }}
                                >
                                    LKR {grandTotal.toLocaleString()}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Information Section - Flex 2 */}
                    <Box sx={{ flex: 2 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                height: 'fit-content'
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    color: '#2c3e50',
                                    fontWeight: 600,
                                    textAlign: 'center'
                                }}
                            >
                                Your Information
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <Stack spacing={4}>
                                    {/* Full Name */}
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={formData.customerName}
                                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                                        required
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: '#f8f9fa',
                                                '&:hover fieldset': {
                                                    borderColor: '#3498db',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#3498db',
                                                    borderWidth: 2,
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#3498db',
                                            },
                                        }}
                                    />

                                    {/* Telephone Number */}
                                    <TextField
                                        fullWidth
                                        label="Telephone Number"
                                        value={formData.customerPhone}
                                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                                        required
                                        variant="outlined"
                                        placeholder="0771234567"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: '#f8f9fa',
                                                '&:hover fieldset': {
                                                    borderColor: '#3498db',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#3498db',
                                                    borderWidth: 2,
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#3498db',
                                            },
                                        }}
                                    />

                                    {/* Address */}
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        required
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        placeholder="Enter your complete address including street, city, and postal code"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: '#f8f9fa',
                                                '&:hover fieldset': {
                                                    borderColor: '#3498db',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#3498db',
                                                    borderWidth: 2,
                                                },
                                            },
                                            '& .MuiInputLabel-root.Mui-focused': {
                                                color: '#3498db',
                                            },
                                        }}
                                    />

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                        sx={{
                                            background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #229f56 0%, #27ae60 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 25px rgba(39, 174, 96, 0.3)'
                                            },
                                            py: 2.5,
                                            fontSize: '1.2rem',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            boxShadow: '0 4px 15px rgba(39, 174, 96, 0.2)',
                                            transition: 'all 0.3s ease',
                                            textTransform: 'none'
                                        }}
                                    >
                                        {loading ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <CircularProgress size={24} color="inherit" />
                                                Processing Order...
                                            </Box>
                                        ) : (
                                            `Place Order • LKR ${grandTotal.toLocaleString()}`
                                        )}
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