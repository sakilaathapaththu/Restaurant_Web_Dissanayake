import React from 'react';
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
import { Favorite, FavoriteBorder, AccessTime, LocalOffer } from '@mui/icons-material';

const FoodCard = ({ food }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card
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
          boxShadow: '0 4px 20px rgba(124, 124, 124, 0.22)',
        },
        borderRadius: 2,
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
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,1)',
            },
          }}
          size="small"
        >
          {isFavorite ? (
            <Favorite sx={{ color: '#ff4444', fontSize: 20 }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: 20 }} />
          )}
        </IconButton>

        {/* Offer Badge */}
        {food.offer && (
          <Chip
            label={food.offer}
            size="small"
            icon={<LocalOffer sx={{ fontSize: 14 }} />}
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              backgroundColor: '#ff4444',
              color: 'white',
              fontSize: '12px',
              height: 24,
            }}
          />
        )}

        {/* Delivery Fee Badge */}
        {food.deliveryFee === 0 && (
          <Chip
            label="Free Delivery"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: '#06c167',
              color: 'white',
              fontSize: '12px',
              height: 24,
            }}
          />
        )}
      </Box>

      {/* Content area with equalized space */}
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
          {/* Restaurant Name */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {food.name}
          </Typography>

          {/* Rating and Reviews */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={food.rating}
              readOnly
              size="small"
              precision={0.1}
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
              {food.rating} ({food.reviewCount.toLocaleString()})
            </Typography>
          </Box>

          {/* Delivery Info */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ fontSize: 16, color: '#666', mr: 0.5 }} />
              <Typography variant="body2" sx={{ color: '#666' }}>
                {food.deliveryTime} min
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666' }}>
              {food.deliveryFee === 0 ? 'Free delivery' : `LKR ${food.deliveryFee} delivery`}
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
                sx={{
                  fontSize: '11px',
                  height: 20,
                  borderColor: '#ddd',
                  color: '#666',
                }}
              />
            ))}
            {food.categories.length > 3 && (
              <Typography
                variant="body2"
                sx={{ color: '#666', fontSize: '11px', alignSelf: 'center' }}
              >
                +{food.categories.length - 3} more
              </Typography>
            )}
          </Box>
        </Box>

        {/* Distance (always bottom aligned) */}
        <Typography variant="body2" sx={{ color: '#999', fontSize: '12px', mt: 'auto' }}>
          {food.distance} km away
        </Typography>
      </CardContent>
    </Card>
  );
};

export default FoodCard;
