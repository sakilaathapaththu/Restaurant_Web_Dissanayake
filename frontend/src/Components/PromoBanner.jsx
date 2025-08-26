import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Paper,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const PromoBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const promoData = [
    {
      id: 1,
      title: 'Just Celeste It!',
      subtitle: 'Get your groceries at in-store prices, TCA',
      buttonText: 'Order Now',
      backgroundColor: '#06c167',
      textColor: 'white',
      image: '/api/placeholder/150/100', // Replace with your image
    },
    {
      id: 2,
      title: 'Shirohana blooms await! 🌸',
      subtitle: 'Spend over Rs. 3,000 and get 20% off, TCA',
      buttonText: 'Order Now',
      backgroundColor: '#f0f0f0',
      textColor: '#000',
      image: '/api/placeholder/150/100', // Replace with your image
    },
    {
      id: 3,
      title: 'LKR 1,000 Off on Salary Week*',
      subtitle: 'Salary week special!',
      buttonText: 'Order Now',
      backgroundColor: '#ff6b35',
      textColor: 'white',
      image: '/api/placeholder/150/100', // Replace with your image
    },
    {
      id: 4,
      title: 'Dissanayake Restaurant Special',
      subtitle: 'Authentic Sri Lankan cuisine with 15% off',
      buttonText: 'Order Now',
      backgroundColor: '#1976d2',
      textColor: 'white',
      image: '/api/placeholder/150/100', // Replace with your image
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promoData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promoData.length) % promoData.length);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ px: 2, py: 2 }}>
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: 'transform 0.5s ease-in-out',
          }}
        >
          {promoData.map((promo) => (
            <Card
              key={promo.id}
              sx={{
                minWidth: '100%',
                backgroundColor: promo.backgroundColor,
                color: promo.textColor,
                position: 'relative',
                overflow: 'hidden',
                height: 160,
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '100%',
                  p: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: promo.textColor,
                    }}
                  >
                    {promo.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 2,
                      color: promo.textColor,
                      opacity: 0.9,
                    }}
                  >
                    {promo.subtitle}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: promo.textColor === 'white' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      color: promo.textColor,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      border: `1px solid ${promo.textColor}`,
                      '&:hover': {
                        backgroundColor: promo.textColor === 'white' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    {promo.buttonText}
                  </Button>
                </Box>
                <Box
                  sx={{
                    width: 120,
                    height: 80,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    ml: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={promo.image}
                    alt={promo.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Navigation Arrows */}
        <IconButton
          onClick={prevSlide}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={nextSlide}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255,255,255,0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          <ChevronRight />
        </IconButton>

        {/* Dots Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          {promoData.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </Box>
      </Box>

      <Typography variant="body2" sx={{ mt: 1, color: '#666', fontSize: 12 }}>
        Additional fees may apply. <Button sx={{ p: 0, textTransform: 'none', fontSize: 12 }}>Learn more</Button>
      </Typography>
    </Box>
  );
};

export default PromoBanner;