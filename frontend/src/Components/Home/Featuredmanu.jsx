import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Fade,
  useScrollTrigger,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RestaurantIcon from '@mui/icons-material/Restaurant';

// Import dish images
import img1 from '../../Asset/images/img1.jpg';
import img2 from '../../Asset/images/img2.jpg';
import img3 from '../../Asset/images/img3.jpg';
import img4 from '../../Asset/images/img4.jpg';
import img5 from '../../Asset/images/img5.jpg';
import img6 from '../../Asset/images/img6.jpg';
import img7 from '../../Asset/images/img7.jpg';
import img8 from '../../Asset/images/img8.jpg';
import img9 from '../../Asset/images/img9.jpg';
import img10 from '../../Asset/images/img10.jpg';

// Styled Components
const SectionContainer = styled(Box)({
  backgroundColor: '#FFF5EE',
  position: 'relative',
  overflow: 'hidden',
  padding: '80px 0',
  '@media (max-width: 1024px)': {
    padding: '70px 0',
  },
  '@media (max-width: 768px)': {
    padding: '60px 0',
  },
  '@media (max-width: 480px)': {
    padding: '50px 0',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 10% 20%, rgba(253, 160, 33, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(253, 160, 33, 0.05) 0%, transparent 50%),
      linear-gradient(135deg, rgba(253, 160, 33, 0.02) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
});

const SectionTitle = styled(Typography)({
  color: '#3c1300',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: '12px',
  fontSize: '2.5rem',
  letterSpacing: '-0.02em',
  position: 'relative',
  '@media (max-width: 1024px)': {
    fontSize: '2.2rem',
  },
  '@media (max-width: 768px)': {
    fontSize: '2rem',
  },
  '@media (max-width: 480px)': {
    fontSize: '1.8rem',
    marginBottom: '10px',
  },
  '@media (max-width: 360px)': {
    fontSize: '1.6rem',
    marginBottom: '8px',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '4px',
    background: 'linear-gradient(90deg, transparent, #fda021, transparent)',
    borderRadius: '2px',
    '@media (max-width: 480px)': {
      bottom: '-8px',
      width: '80px',
      height: '3px',
    },
    '@media (max-width: 360px)': {
      bottom: '-6px',
      width: '60px',
    },
  },
});

const SectionSubtitle = styled(Typography)({
  color: '#3c1300',
  textAlign: 'center',
  opacity: 0.8,
  marginBottom: '60px',
  fontSize: '1.1rem',
  fontWeight: 400,
  maxWidth: '600px',
  margin: '0 auto 60px auto',
  padding: '0 20px',
  '@media (max-width: 1024px)': {
    fontSize: '1.05rem',
    marginBottom: '50px',
    margin: '0 auto 50px auto',
  },
  '@media (max-width: 768px)': {
    fontSize: '1rem',
    marginBottom: '40px',
    margin: '0 auto 40px auto',
    maxWidth: '500px',
  },
  '@media (max-width: 480px)': {
    fontSize: '0.95rem',
    marginBottom: '35px',
    margin: '0 auto 35px auto',
    maxWidth: '400px',
    padding: '0 16px',
  },
  '@media (max-width: 360px)': {
    fontSize: '0.9rem',
    marginBottom: '30px',
    margin: '0 auto 30px auto',
    maxWidth: '320px',
    padding: '0 12px',
  },
});

const SliderContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(60, 19, 0, 0.08)',
});

const SliderTrack = styled(Box)({
  display: 'flex',
  willChange: 'transform',
});

const DishCard = styled(Card)({
  minWidth: '320px',
  width: '320px',
  height: '420px',
  margin: '0 16px',
  borderRadius: '24px',
  overflow: 'hidden',
  backgroundColor: '#ffffff',
  boxShadow: '0 8px 32px rgba(60, 19, 0, 0.12)',
  border: '1px solid rgba(253, 160, 33, 0.1)',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  position: 'relative',
  cursor: 'pointer',
  flexShrink: 0,
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 16px 48px rgba(60, 19, 0, 0.18)',
    '& .dish-image': {
      transform: 'scale(1.08)',
    },
    '& .dish-overlay': {
      opacity: 1,
    },
    '& .dish-content': {
      transform: 'translateY(-4px)',
    },
    '@media (max-width: 768px)': {
      transform: 'translateY(-4px) scale(1.01)',
    },
  },
  '@media (max-width: 1024px)': {
    minWidth: '300px',
    width: '300px',
    height: '400px',
    margin: '0 14px',
  },
  '@media (max-width: 768px)': {
    minWidth: '280px',
    width: '280px',
    height: '380px',
    margin: '0 12px',
    borderRadius: '20px',
  },
  '@media (max-width: 480px)': {
    minWidth: '260px',
    width: '260px',
    height: '360px',
    margin: '0 10px',
    borderRadius: '16px',
  },
  '@media (max-width: 360px)': {
    minWidth: '240px',
    width: '240px',
    height: '340px',
    margin: '0 8px',
  },
});

const DishImage = styled(CardMedia)({
  height: '240px',
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '@media (max-width: 1024px)': {
    height: '220px',
  },
  '@media (max-width: 768px)': {
    height: '200px',
  },
  '@media (max-width: 480px)': {
    height: '180px',
  },
  '@media (max-width: 360px)': {
    height: '160px',
  },
});

const ImageOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(180deg, transparent 0%, rgba(60, 19, 0, 0.3) 100%)',
  opacity: 0,
  transition: 'opacity 0.4s ease',
});

const PriceChip = styled(Chip)({
  position: 'absolute',
  top: '16px',
  right: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  color: '#3c1300',
  fontWeight: 700,
  fontSize: '0.9rem',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(253, 160, 33, 0.3)',
  boxShadow: '0 4px 12px rgba(60, 19, 0, 0.1)',
  '&:hover': {
    backgroundColor: '#fda021',
    color: '#ffffff',
  },
  '@media (max-width: 768px)': {
    top: '12px',
    right: '12px',
    fontSize: '0.85rem',
    padding: '4px 8px',
  },
  '@media (max-width: 480px)': {
    top: '10px',
    right: '10px',
    fontSize: '0.8rem',
    padding: '2px 6px',
  },
});

const NavigationButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  color: '#3c1300',
  width: '56px',
  height: '56px',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(253, 160, 33, 0.2)',
  boxShadow: '0 8px 24px rgba(60, 19, 0, 0.15)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  zIndex: 10,
  '&:hover': {
    backgroundColor: '#fda021',
    color: '#ffffff',
    transform: 'translateY(-50%) scale(1.1)',
    boxShadow: '0 12px 32px rgba(253, 160, 33, 0.3)',
  },
  '&.prev': {
    left: '20px',
  },
  '&.next': {
    right: '20px',
  },
  '@media (max-width: 1024px)': {
    width: '52px',
    height: '52px',
    '&.prev': {
      left: '16px',
    },
    '&.next': {
      right: '16px',
    },
  },
  '@media (max-width: 768px)': {
    width: '48px',
    height: '48px',
    '&.prev': {
      left: '12px',
    },
    '&.next': {
      right: '12px',
    },
  },
  '@media (max-width: 480px)': {
    width: '44px',
    height: '44px',
    '&.prev': {
      left: '8px',
    },
    '&.next': {
      right: '8px',
    },
  },
  '@media (max-width: 360px)': {
    width: '40px',
    height: '40px',
    '&.prev': {
      left: '6px',
    },
    '&.next': {
      right: '6px',
    },
  },
});

const ViewMenuButton = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  backgroundColor: '#fda021',
  color: '#3c1300',
  padding: '16px 32px',
  borderRadius: '50px',
  fontSize: '1.1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  boxShadow: '0 6px 20px rgba(253, 160, 33, 0.3)',
  margin: '60px auto 0 auto',
  width: 'fit-content',
  textTransform: 'none',
  letterSpacing: '0.5px',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#fda021',
    border: '2px solid #fda021',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(253, 160, 33, 0.4)',
    '& .menu-icon': {
      transform: 'rotate(360deg)',
    },
  },
  '@media (max-width: 1024px)': {
    padding: '15px 30px',
    fontSize: '1.05rem',
    margin: '50px auto 0 auto',
  },
  '@media (max-width: 768px)': {
    padding: '14px 28px',
    fontSize: '1rem',
    margin: '40px auto 0 auto',
    gap: '10px',
  },
  '@media (max-width: 480px)': {
    padding: '12px 24px',
    fontSize: '0.95rem',
    margin: '35px auto 0 auto',
    gap: '8px',
  },
  '@media (max-width: 360px)': {
    padding: '10px 20px',
    fontSize: '0.9rem',
    margin: '30px auto 0 auto',
  },
});

const ScrollAnimation = ({ children, delay = 0 }) => {
  const trigger = useScrollTrigger({
    threshold: 0.2,
    disableHysteresis: true,
  });

  return (
    <Fade in={trigger} timeout={800} style={{ transitionDelay: `${delay}ms` }}>
      <div>{children}</div>
    </Fade>
  );
};

const DishesShowcaseSection = () => {
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // Dishes data with imported images
  const dishes = [
    {
      id: 1,
      name: 'Chicken Salad',
      description: 'Chicken salad combines tender chicken, fresh vegetables, herbs, and dressing for refreshing flavor.',
      price: 'LKR 750.00',
      category: 'Salad',
      image: img1,
    },
    {
      id: 2,
      name: 'Cream of Chicken',
      description: 'Creamy chicken soup blends tender chicken, vegetables, and rich broth for comfort.',
      price: 'LKR 490.00',
      category: 'Soups',
      image: img2,
    },
    {
      id: 3,
      name: 'Crispy Chicken (250G)',
      description: 'Crispy chicken features golden-brown coating, juicy meat, and satisfying crunchy texture.',
      price: 'LKR 850.00',
      category: 'Starters',
      image: img3,
    },
    {
      id: 4,
      name: 'Watermelon Juice',
      description: 'Watermelon juice offers refreshing sweetness, vibrant color, and natural hydrating summer delight.',
      price: 'LKR 300.00',
      category: 'Fruit Juice',
      image: img4,
    },
    {
      id: 5,
      name: 'Chicken Fried Rice (Large)',
      description: 'Chicken fried rice mixes Basmathi rice, chicken, vegetables, and savory flavors.',
      price: 'LKR 1300.00',
      category: 'Basmathi Rice',
      image: img5,
    },
    {
      id: 6,
      name: 'Grilled Chicken Sizzling',
      description: 'Experience the perfect blend of smoky flavors and juicy tenderness with our Grilled Chicken Sizzling',
      price: 'LKR 3000.00',
      category: 'Meat, Poultry & Seafood',
      image: img6,
    },
    {
      id: 7,
      name: 'Chicken Kottu (Large)',
      description: 'Savor the vibrant flavors of Sri Lanka with our hearty and spicy Chicken Kottu.',
      price: 'LKR 1000.00',
      category: 'Kottu',
      image: img7,
    },
    {
      id: 8,
      name: 'Mixed Noodles (Large)',
      description: 'Mixed Noodles is a flavorful dish combining a variety of noodles with vegetables, sauces, and spices.',
      price: 'LKR 1150.00',
      category: 'Noodles',
      image: img8,
    },
    {
      id: 9,
      name: 'Cheese Chicken Pasta',
      description: 'Cheese Chicken Pasta is a creamy, cheesy pasta with tender chicken.',
      price: 'LKR 1000.00',
      category: 'Pasta',
      image: img9,
    },
    {
      id: 10,
      name: 'Chocolate Milkshake',
      description: 'Chocolate Milkshake is a rich and creamy blend of chocolate and milk.',
      price: 'LKR 600.00',
      category: 'Milkshake',
      image: img10,
    },
  ];

  // Create extended array for infinite scroll
  const extendedDishes = [...dishes, ...dishes, ...dishes];
  const cardWidth = 352; // 320px + 32px margin
  const totalOriginalWidth = dishes.length * cardWidth;

  // Responsive card widths
  const getCardWidth = () => {
    if (window.innerWidth <= 360) return 256; // 240px + 16px margin
    if (window.innerWidth <= 480) return 280; // 260px + 20px margin
    if (window.innerWidth <= 768) return 304; // 280px + 24px margin
    if (window.innerWidth <= 1024) return 328; // 300px + 28px margin
    return 352; // 320px + 32px margin
  };

  // Auto-slide functionality with infinite loop
  useEffect(() => {
    if (!isHovered && !isTransitioning) {
      intervalRef.current = setInterval(() => {
        setCurrentTranslate((prev) => {
          const newTranslate = prev - cardWidth;
          
          // If we've moved past one full set, reset to beginning
          if (Math.abs(newTranslate) >= totalOriginalWidth) {
            // Smooth transition to reset position
            setTimeout(() => {
              setIsTransitioning(true);
              setCurrentTranslate(0);
              setTimeout(() => setIsTransitioning(false), 50);
            }, 0);
            return newTranslate;
          }
          
          return newTranslate;
        });
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, isTransitioning, cardWidth, totalOriginalWidth]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    
    setCurrentTranslate((prev) => {
      const newTranslate = prev + cardWidth;
      
      // If moving forward past the beginning, jump to the end
      if (newTranslate > 0) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentTranslate(-totalOriginalWidth + cardWidth);
          setTimeout(() => setIsTransitioning(false), 50);
        }, 0);
        return prev;
      }
      
      return newTranslate;
    });
  };

  const handleNext = () => {
    if (isTransitioning) return;
    
    setCurrentTranslate((prev) => {
      const newTranslate = prev - cardWidth;
      
      // If we've moved past one full set, reset to beginning
      if (Math.abs(newTranslate) >= totalOriginalWidth) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentTranslate(-cardWidth);
          setTimeout(() => setIsTransitioning(false), 50);
        }, 0);
        return prev;
      }
      
      return newTranslate;
    });
  };

  // Navigate to the public ItemePage
  const handleMenuNavigation = () => {
    navigate('/menu'); // Navigate to ItemePage.jsx
  };

  return (
    <SectionContainer>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <ScrollAnimation>
          <Box>
            <SectionTitle variant="h2" component="h2">
              Culinary Collection
            </SectionTitle>
            <SectionSubtitle variant="h6">
              Experience our finest dish collection, where every dish tells a story of passion, 
              precision, and exceptional flavor profiles
            </SectionSubtitle>
          </Box>
        </ScrollAnimation>

        {/* Dishes Slider */}
        <ScrollAnimation delay={200}>
          <SliderContainer
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Navigation Buttons */}
            <NavigationButton
              className="prev"
              onClick={handlePrevious}
              aria-label="Previous dishes"
            >
              <ArrowBackIosIcon />
            </NavigationButton>

            <NavigationButton
              className="next"
              onClick={handleNext}
              aria-label="Next dishes"
            >
              <ArrowForwardIosIcon />
            </NavigationButton>

            {/* Slider Track */}
            <SliderTrack
              ref={sliderRef}
              sx={{
                transform: `translateX(${currentTranslate}px)`,
                transition: isTransitioning ? 'none' : 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {extendedDishes.map((dish, index) => (
                <DishCard key={`${dish.id}-${Math.floor(index / dishes.length)}`}>
                  <Box sx={{ position: 'relative' }}>
                    <DishImage
                      className="dish-image"
                      image={dish.image}
                      title={dish.name}
                    />
                    <ImageOverlay className="dish-overlay" />
                    <PriceChip label={dish.price} />
                  </Box>
                  
                  <CardContent 
                    className="dish-content"
                    sx={{ 
                      p: 3,
                      transition: 'transform 0.3s ease',
                      '@media (max-width: 768px)': {
                        p: 2,
                      },
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={dish.category}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(253, 160, 33, 0.1)',
                          color: '#3c1300',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        color: '#3c1300',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        mb: 1,
                        lineHeight: 1.3,
                      }}
                    >
                      {dish.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#3c1300',
                        opacity: 0.8,
                        lineHeight: 1.6,
                        fontSize: '0.9rem',
                      }}
                    >
                      {dish.description}
                    </Typography>
                  </CardContent>
                </DishCard>
              ))}
            </SliderTrack>
          </SliderContainer>
        </ScrollAnimation>

        {/* View Menu Button */}
        <ScrollAnimation delay={400}>
          <ViewMenuButton onClick={handleMenuNavigation}>
            <RestaurantIcon 
              className="menu-icon"
              sx={{ 
                transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fontSize: '1.3rem'
              }} 
            />
            <Typography component="span" sx={{ fontWeight: 600 }}>
              Explore Full Menu
            </Typography>
          </ViewMenuButton>
        </ScrollAnimation>
      </Container>
    </SectionContainer>
  );
};

export default DishesShowcaseSection;