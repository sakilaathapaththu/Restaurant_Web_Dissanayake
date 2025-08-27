import React, { useState } from 'react';
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
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const FoodOrderModal = ({ open, onClose, food }) => {
  const [quantity, setQuantity] = useState(1);

  if (!food) return null;

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{food.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <img
            src={food.image}
            alt={food.name}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Box>

        <Typography variant="h6" sx={{ color: '#06c167', mb: 1 }}>
          LKR {food.price?.toLocaleString()}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Categories: {food.categories.join(', ')}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Rating: {food.rating} ({food.reviewCount.toLocaleString()})
        </Typography>

        {food.offer && (
          <Typography variant="body2" sx={{ color: '#ff4444', mb: 1 }}>
            Offer: {food.offer}
          </Typography>
        )}

        {/* Quantity selector */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1 }}>
          <IconButton onClick={handleDecrease}>
            <Remove />
          </IconButton>
          <TextField
            value={quantity}
            size="small"
            inputProps={{ style: { textAlign: 'center', width: '40px' } }}
          />
          <IconButton onClick={handleIncrease}>
            <Add />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 2 }}>
            Total: LKR {(food.price * quantity).toLocaleString()}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary">
          Add to Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FoodOrderModal;
