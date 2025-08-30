import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useCart } from '../../context/CartContext';

const FoodOrderModal = ({ open, onClose, food, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedPortionIndex, setSelectedPortionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { addToCart } = useCart();

  useEffect(() => {
    if (open && food) {
      setSelectedPortionIndex(0);
      setQuantity(1);
      setError('');
      setSuccess('');
    }
  }, [open, food]);

  if (!food) return null;

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const hasMultiplePortions = food.portions && food.portions.length > 1;

  const getCurrentPrice = () => {
    if (hasMultiplePortions && food.portions[selectedPortionIndex]) {
      return food.portions[selectedPortionIndex].finalPrice || food.portions[selectedPortionIndex].price || 0;
    }
    return food.price || 0;
  };

  const getCurrentPortionLabel = () => {
    if (hasMultiplePortions && food.portions[selectedPortionIndex]) {
      return food.portions[selectedPortionIndex].label;
    }
    return "Standard";
  };

  const currentPrice = getCurrentPrice();
  const totalPrice = currentPrice * quantity;

  const handleAddToCart = async () => {
    setLoading(true);
    setError('');

    try {
      const cartItem = {
        foodId: food._id || food.id,
        name: food.name,
        image: food.image,
        price: currentPrice,
        quantity: quantity,
        selectedPortion: hasMultiplePortions ? {
          index: selectedPortionIndex,
          label: getCurrentPortionLabel(),
          price: currentPrice
        } : { index: 0, label: "Standard", price: currentPrice }
      };

      const result = await addToCart(cartItem);

      if (result.success) {
        setSuccess('Item added to cart successfully!');
        if (onAddToCart) onAddToCart(cartItem, result.data);
        setTimeout(() => onClose(), 1500);
      } else {
        setError(result.error || 'Failed to add item to cart');
      }
    } catch (err) {
      setError(err.message || 'Failed to add item to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: '#2c1000' }}>{food.name}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2, backgroundColor: '#fda021', color: '#2c1000' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, backgroundColor: '#2c1000', color: '#e8d5c4' }}>{success}</Alert>}

        <Box sx={{ mb: 2 }}>
          <img
            src={food.image}
            alt={food.name}
            style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }}
          />
        </Box>

        {food.menuId && <Typography variant="body2" sx={{ color: '#2c1000', mb: 1 }}>Item ID: {food.menuId}</Typography>}
        {food.description && <Typography variant="body2" sx={{ mb: 2, color: '#2c1000' }}>{food.description}</Typography>}

        {hasMultiplePortions && (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#2c1000' }}>Select Portion</InputLabel>
              <Select
                value={selectedPortionIndex}
                onChange={(e) => setSelectedPortionIndex(e.target.value)}
                label="Select Portion"
                sx={{ color: '#2c1000' }}
              >
                {food.portions.map((portion, index) => (
                  <MenuItem key={index} value={index} sx={{ color: '#2c1000' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography>{portion.label}</Typography>
                      <Typography sx={{ fontWeight: 'bold', color: '#fda021' }}>
                        LKR {(portion.finalPrice || portion.price || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Divider sx={{ mb: 2, borderColor: '#2c1000' }} />
          </>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#fda021', mb: 1 }}>
            LKR {currentPrice.toLocaleString()}
            {hasMultiplePortions && (
              <Typography component="span" variant="body2" sx={{ ml: 1, color: '#2c1000' }}>
                ({getCurrentPortionLabel()})
              </Typography>
            )}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 1, color: '#2c1000' }}>
          Categories: {food.categories ? food.categories.join(', ') : 'N/A'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: '#2c1000' }}>
          Rating: {food.rating} ({food.reviewCount ? food.reviewCount.toLocaleString() : 0} reviews)
        </Typography>
        {food.offer && <Typography variant="body2" sx={{ color: '#fda021', mb: 1 }}>Offer: {food.offer}</Typography>}

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
          <IconButton
            onClick={handleDecrease}
            disabled={loading}
            sx={{
              border: '1px solid #2c1000',
              '&:hover': { backgroundColor: '#e8d5c4' },
              color: '#2c1000'
            }}
          >
            <Remove />
          </IconButton>
          <TextField
            value={quantity}
            size="small"
            inputProps={{
              style: { textAlign: 'center', width: '50px', color: '#2c1000' },
              readOnly: true
            }}
            sx={{ mx: 1 }}
          />
          <IconButton
            onClick={handleIncrease}
            disabled={loading}
            sx={{
              border: '1px solid #2c1000',
              '&:hover': { backgroundColor: '#e8d5c4' },
              color: '#2c1000'
            }}
          >
            <Add />
          </IconButton>
        </Box>

        <Box sx={{
          mt: 3,
          p: 2,
          backgroundColor: '#e8d5c4',
          borderRadius: 1,
          border: '1px solid #2c1000'
        }}>
          <Typography variant="h6" sx={{ color: '#2c1000', textAlign: 'center' }}>
            Total: LKR {totalPrice.toLocaleString()}
          </Typography>
          {quantity > 1 && (
            <Typography variant="body2" sx={{ color: '#2c1000', textAlign: 'center', mt: 0.5 }}>
              {quantity} × LKR {currentPrice.toLocaleString()}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderColor: '#2c1000',
            color: '#2c1000',
            '&:hover': { borderColor: '#fda021', color: '#fda021' }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAddToCart}
          disabled={loading}
          sx={{
            backgroundColor: '#fda021',
            color: '#2c1000',
            '&:hover': { backgroundColor: '#e8b020' },
            minWidth: '120px'
          }}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ mr: 1, color: '#2c1000' }} />
          ) : (
            'Add to Cart'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FoodOrderModal;
