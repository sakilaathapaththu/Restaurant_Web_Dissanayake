import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Rating,
} from '@mui/material';
import { Favorite, FavoriteBorder, LocalOffer } from '@mui/icons-material';
import FoodOrderModal from './FoodOrderModal';

const FoodCard = ({ food }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{
          width: 280,
          height: 370,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          m: 1,
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(44,16,0,0.22)', // dark brown shadow
          },
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="180"
            image={food.image}
            alt={food.name}
            sx={{ objectFit: 'cover' }}
          />

          {/* Favorite Button */}
          <IconButton
            onClick={handleFavoriteClick}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(232,213,196,0.9)', // beige semi-transparent
              '&:hover': { backgroundColor: 'rgba(232,213,196,1)' },
            }}
            size="small"
          >
            {isFavorite ? (
              <Favorite sx={{ color: '#fda021', fontSize: 20 }} /> // accent orange
            ) : (
              <FavoriteBorder sx={{ color: '#2c1000', fontSize: 20 }} /> // dark brown
            )}
          </IconButton>

          {/* Offer Badge */}
          {food.offer && (
            <Chip
              label={food.offer}
              size="small"
              icon={<LocalOffer sx={{ fontSize: 14, color: '#fff' }} />}
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                backgroundColor: '#fda021', // accent orange
                color: '#fff',
                fontSize: '12px',
                height: 24,
              }}
            />
          )}

          {/* Free Delivery Badge */}
          {food.deliveryFee === 0 && (
            <Chip
              label="pickup"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: '#2c1000', // dark brown
                color: '#e8d5c4', // light beige
                fontSize: '12px',
                height: 24,
              }}
            />
          )}
        </Box>

        <CardContent
          sx={{
            p: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            {/* Food Name */}
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: '#2c1000', // dark brown
              }}
            >
              {food.name}
            </Typography>

            {/* Price & Delivery Fee */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#fda021' }}>
                LKR {food.price?.toLocaleString()}
              </Typography>

              <Typography variant="body2" sx={{ color: '#2c1000' }}>
                {food.deliveryFee === 0
                  ? 'pickup'
                  : `LKR ${food.deliveryFee} delivery`}
              </Typography>
            </Box>

            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={food.rating} readOnly size="small" precision={0.1} sx={{ mr: 1, color: '#fda021' }} />
              <Typography variant="body2" sx={{ color: '#2c1000', fontSize: '14px' }}>
                {food.rating} ({food.reviewCount.toLocaleString()})
              </Typography>
            </Box>

            {/* Categories */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {food.categories.slice(0, 3).map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '11px', height: 20, borderColor: '#2c1000', color: '#2c1000' }}
                />
              ))}
              {food.categories.length > 3 && (
                <Typography
                  variant="body2"
                  sx={{ color: '#2c1000', fontSize: '11px', alignSelf: 'center' }}
                >
                  +{food.categories.length - 3} more
                </Typography>
              )}
            </Box>
          </Box>

          {/* Distance */}
          <Typography variant="body2" sx={{ color: '#999', fontSize: '12px', mt: 'auto' }}>
            {food.distance} km away
          </Typography>
        </CardContent>
      </Card>

      {/* Modal */}
      <FoodOrderModal open={modalOpen} onClose={handleCloseModal} food={food} />
    </>
  );
};

export default FoodCard;
