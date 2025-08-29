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
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const FoodOrderModal = ({ open, onClose, food }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedPortionIndex, setSelectedPortionIndex] = useState(0);

  // Reset selected portion when food changes or modal opens
  useEffect(() => {
    if (open && food) {
      setSelectedPortionIndex(0);
      setQuantity(1);
    }
  }, [open, food]);

  if (!food) return null;

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  // Check if food has multiple portions (from backend data)
  const hasMultiplePortions = food.portions && food.portions.length > 1;

  // Get current price based on selected portion
  const getCurrentPrice = () => {
    if (hasMultiplePortions && food.portions[selectedPortionIndex]) {
      return food.portions[selectedPortionIndex].finalPrice || food.portions[selectedPortionIndex].price || 0;
    }
    return food.price || 0;
  };

  // Get current portion label
  const getCurrentPortionLabel = () => {
    if (hasMultiplePortions && food.portions[selectedPortionIndex]) {
      return food.portions[selectedPortionIndex].label;
    }
    return "Standard";
  };

  const currentPrice = getCurrentPrice();
  const totalPrice = currentPrice * quantity;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{food.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <img
            src={food.image}
            alt={food.name}
            style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }}
          />
        </Box>

        {/* Menu ID */}
        {food.menuId && (
          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
            Item ID: {food.menuId}
          </Typography>
        )}

        {/* Description */}
        {food.description && (
          <Typography variant="body2" sx={{ mb: 2, color: '#333' }}>
            {food.description}
          </Typography>
        )}

        {/* Portion Selection - Only show if multiple portions */}
        {hasMultiplePortions && (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Portion</InputLabel>
              <Select
                value={selectedPortionIndex}
                onChange={(e) => setSelectedPortionIndex(e.target.value)}
                label="Select Portion"
              >
                {food.portions.map((portion, index) => (
                  <MenuItem key={index} value={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography>{portion.label}</Typography>
                      <Typography sx={{ fontWeight: 'bold', color: '#06c167' }}>
                        LKR {(portion.finalPrice || portion.price || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Divider sx={{ mb: 2 }} />
          </>
        )}

        {/* Current Price Display */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#06c167', mb: 1 }}>
            LKR {currentPrice.toLocaleString()}
            {hasMultiplePortions && (
              <Typography component="span" variant="body2" sx={{ ml: 1, color: '#666' }}>
                ({getCurrentPortionLabel()})
              </Typography>
            )}
          </Typography>
        </Box>

        {/* Other food details */}
        <Typography variant="body2" sx={{ mb: 1 }}>
          Categories: {food.categories ? food.categories.join(', ') : 'N/A'}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Rating: {food.rating} ({food.reviewCount ? food.reviewCount.toLocaleString() : 0} reviews)
        </Typography>

        {food.offer && (
          <Typography variant="body2" sx={{ color: '#ff4444', mb: 1 }}>
            Offer: {food.offer}
          </Typography>
        )}

        {/* Quantity selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
          <IconButton
            onClick={handleDecrease}
            sx={{
              border: '1px solid #ddd',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <Remove />
          </IconButton>
          <TextField
            value={quantity}
            size="small"
            inputProps={{
              style: { textAlign: 'center', width: '50px' },
              readOnly: true
            }}
            sx={{ mx: 1 }}
          />
          <IconButton
            onClick={handleIncrease}
            sx={{
              border: '1px solid #ddd',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <Add />
          </IconButton>
        </Box>

        {/* Total Price Display */}
        <Box sx={{
          mt: 3,
          p: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid #e9ecef'
        }}>
          <Typography variant="h6" sx={{ color: '#06c167', textAlign: 'center' }}>
            Total: LKR {totalPrice.toLocaleString()}
          </Typography>
          {quantity > 1 && (
            <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mt: 0.5 }}>
              {quantity} × LKR {currentPrice.toLocaleString()}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: '#06c167',
            '&:hover': { backgroundColor: '#05a356' },
            minWidth: '120px'
          }}
        >
          Add to Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FoodOrderModal;