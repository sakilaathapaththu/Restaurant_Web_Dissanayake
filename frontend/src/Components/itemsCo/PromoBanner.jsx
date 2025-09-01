import React, { useState , useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// Import your local images
import img1 from '../../Asset/images/promo/itembanner1.png';
import img2 from '../../Asset/images/promo/itembanner2.png';
import img4 from '../../Asset/images/promo/itembanner4.png';
import img3 from '../../Asset/images/promo/itembanner3.png';

const PromoBanner = ({ onCategorySelect }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const promoData = [
    {
      id: 1,
      title: 'Dissanayake Restaurant Special',
      subtitle: 'Juicy, golden, perfectly spiced chicken.',
      buttonText: 'Order Now',
      backgroundColor: '#06c16788',
      textColor: 'white',
      image: img3,
      category: 'Chicken', 
    },
    {
      id: 2,
      title: 'A Bowl of Goodness',
      subtitle: 'Freshly tossed salads with vibrant flavors.',
      buttonText: 'Explore Salads',
      backgroundColor: '#f0f088',
      textColor: '#ffffffff',
      image: img2,
      category: 'Salad',
    },
    {
      id: 3,
      title: 'Sip the Freshness!',
      subtitle: 'Hand-crafted juices made with real fruits.',
      buttonText: 'Order Now',
      backgroundColor: '#ff6b3588',
      textColor: 'white',
      image: img1,
      category: 'Fruit Juice',
    },
    {
      id: 4,
      title: 'Brewed for You',
      subtitle: 'Rich, bold coffee made to energize your day.',
      buttonText: 'Grab a Cup',
      backgroundColor: '#1976d288',
      textColor: 'white',
      image: img4,
      category: 'Beverages',
    },
  ];

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % promoData.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + promoData.length) % promoData.length);

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
                height: { xs: 130, md: 260 },
                position: 'relative',
                borderRadius: 2,
                color: promo.textColor,
                backgroundImage: `url(${promo.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: '0.3s',
                overflow: 'hidden',
              }}
            >
              {/* Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: 2,
                  backgroundColor: 'rgba(25, 25, 25, 0.23)',
                  transition: '0.3s',
                  zIndex: 1,
                  '&:hover': {
                    backgroundColor: promo.backgroundColor,
                    backgroundBlendMode: 'overlay',
                  },
                }}
              />

              {/* Content */}
              <CardContent
                sx={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: { xs: 'flex-start', md: 'space-between' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  height: { xs: 'auto', md: '100%' },
                  p: { xs: 2, md: 4 },
                  pl: { xs: 3, md: 6 },
                  gap: { xs: 1, md: 0 },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: 20, md: 40 } }}
                  >
                    {promo.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 2, opacity: 0.9, fontSize: { xs: 12, md: 16 } }}
                  >
                    {promo.subtitle}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => onCategorySelect(promo.category)} 
                    sx={{
                      color: 'white',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      border: '1px solid white',
                      fontSize: { xs: 12, md: 14 },
                      py: { xs: 0.5, md: 1 },
                      px: { xs: 1.5, md: 3 },
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                    }}
                  >
                    {promo.buttonText}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Arrows */}
        <IconButton
          onClick={prevSlide}
          sx={{
            position: 'absolute',
            left: -8,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={nextSlide}
          sx={{
            position: 'absolute',
            right: -8,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' },
          }}
        >
          <ChevronRight />
        </IconButton>

        {/* Dots */}
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
                backgroundColor:
                  currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PromoBanner;
