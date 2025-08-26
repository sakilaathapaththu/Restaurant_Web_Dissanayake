import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Fade,
  Zoom,
  useScrollTrigger,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Import local images from assets folder
import nasiImg from '../../Asset/images/nasi.jpg';
import mongoImg from '../../Asset/images/mongo2.jpg';
import biryaniImg from '../../Asset/images/biryani2.jpg';

// Styled components for enhanced design
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  margin: '0 auto',
  borderRadius: '16px',
  boxShadow: '0 4px 16px rgba(46, 15, 0, 0.08)',
  transition: 'all 0.25s ease-in-out',
  overflow: 'hidden',
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(253, 160, 33, 0.1)',
  // Mobile specific styles
  '@media (max-width: 600px)': {
    maxWidth: '100%',
    margin: '0',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(46, 15, 0, 0.06)',
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(46, 15, 0, 0.12)',
    // Minimal hover effects on mobile
    '@media (max-width: 600px)': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(46, 15, 0, 0.08)',
    },
    '& .card-media': {
      transform: 'scale(1.05)',
    },
    '& .price-tag': {
      backgroundColor: '#fda021',
      color: '#FFFFFF',
    },
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 280,
  position: 'relative',
  transition: 'transform 0.3s ease-in-out',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  // Mobile specific styles
  '@media (max-width: 600px)': {
    height: 200,
  },
});

const PriceTag = styled(Box)({
  position: 'absolute',
  top: 16,
  right: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  color: '#2e0f00',
  padding: '6px 12px',
  borderRadius: '16px',
  fontWeight: 'bold',
  fontSize: '1rem',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(253, 160, 33, 0.3)',
  transition: 'all 0.2s ease',
  // Mobile specific styles
  '@media (max-width: 600px)': {
    top: 12,
    right: 12,
    padding: '4px 10px',
    fontSize: '0.9rem',
    borderRadius: '12px',
  },
});

const SectionTitle = styled(Typography)({
  color: '#2e0f00',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: '16px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    backgroundColor: '#fda021',
    borderRadius: '2px',
  },
});

const SectionSubtitle = styled(Typography)({
  color: '#2e0f00',
  textAlign: 'center',
  opacity: 0.8,
  marginBottom: '48px',
  fontWeight: 400,
});

// Styled Menu Button with updated color theme
const MenuButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#fda021',
  color: '#3c1300',
  padding: '14px 32px',
  borderRadius: '50px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 16px rgba(253, 160, 33, 0.25)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  border: '2px solid transparent',
  minWidth: '200px',
  // Mobile specific styles
  '@media (max-width: 600px)': {
    padding: '12px 28px',
    fontSize: '1rem',
    minWidth: '180px',
  },
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#fda021',
    border: '2px solid #fda021',
    boxShadow: '0 6px 20px rgba(253, 160, 33, 0.3)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
  // Ripple effect
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    transition: 'left 0.6s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
}));

// Animation component for scroll-triggered animations - Much gentler
const ScrollAnimation = ({ children, delay = 0 }) => {
  const trigger = useScrollTrigger({
    threshold: 0.3, // Higher threshold - triggers later
    disableHysteresis: true,
  });

  return (
    <Fade in={trigger} timeout={400} style={{ transitionDelay: `${delay}ms` }}>
      <div>{children}</div>
    </Fade>
  );
};

const HighlightsSection = () => {
  const navigate = useNavigate();

  // Handle navigation to menu page
  const handleMenuClick = () => {
    navigate('/menu');
  };

  // Popular dishes data with imported local images
  const popularDishes = [
    {
      id: 1,
      name: 'Special Nasi Goreng',
      description: 'Nasi Goreng is Indonesian fried rice with spices, vegetables, meat, or seafood.',
      price: 'LKR 1200.00',
      image: nasiImg,
      alt: 'Special Nasi Platter'
    },
    {
      id: 2,
      name: 'Mongolian Fried Rice',
      description: 'Mongolian fried rice blends rice, vegetables, meat, and sauces for bold flavors.',
      price: 'LKR 1600.00',
      image: mongoImg,
      alt: 'Mongo Curry Delight'
    },
    {
      id: 3,
      name: 'Aromatic Biryani',
      description: 'Aromatic Biryani layers fragrant rice, tender meat or vegetables, and rich spices.',
      price: 'LKR 1200.00',
      image: biryaniImg,
      alt: 'Aromatic Biryani'
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#FFF5EE', // Seashells white
        py: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(253, 160, 33, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(253, 160, 33, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Fade in timeout={600}>
          <Box>
            <SectionTitle variant="h3" component="h2">
              Chef's Special Selection
            </SectionTitle>
            <SectionSubtitle variant="h6">
              Discover our most popular dishes, crafted with passion and premium ingredients
            </SectionSubtitle>
          </Box>
        </Fade>

        {/* Dishes Grid - Force single row on desktop */}
        <Grid 
          container 
          spacing={{ xs: 2, sm: 3, md: 4 }} 
          sx={{ 
            justifyContent: 'center',
            // Force single row on desktop
            '@media (min-width: 900px)': {
              flexWrap: 'nowrap',
              gap: '24px',
            }
          }}
        >
          {popularDishes.map((dish, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={dish.id} 
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                // Desktop specific styling
                '@media (min-width: 900px)': {
                  flex: '1 1 0',
                  maxWidth: 'none',
                  minWidth: '280px',
                }
              }}
            >
              <ScrollAnimation delay={index * 100}>
                <StyledCard>
                  <Box sx={{ position: 'relative' }}>
                    <StyledCardMedia
                      className="card-media"
                      image={dish.image}
                      title={dish.alt}
                      sx={{ backgroundImage: `url(${dish.image})` }}
                    />
                    <PriceTag className="price-tag">
                      {dish.price}
                    </PriceTag>
                  </Box>
                  
                  <CardContent sx={{ 
                    p: 3,
                    '@media (max-width: 600px)': {
                      p: 2,
                    },
                  }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h3"
                      sx={{
                        color: '#2e0f00',
                        fontWeight: 600,
                        fontSize: '1.3rem',
                        mb: 2,
                        '@media (max-width: 600px)': {
                          fontSize: '1.1rem',
                          mb: 1.5,
                        },
                      }}
                    >
                      {dish.name}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#2e0f00',
                        opacity: 0.8,
                        lineHeight: 1.6,
                        fontSize: '0.95rem',
                        '@media (max-width: 600px)': {
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                        },
                      }}
                    >
                      {dish.description}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </ScrollAnimation>
            </Grid>
          ))}
        </Grid>

        {/* Menu Button Section */}
        <ScrollAnimation delay={400}>
          <Box sx={{ 
            textAlign: 'center', 
            mt: { xs: 5, md: 6 },
            mb: 2
          }}>
            <Zoom in timeout={600} style={{ transitionDelay: '500ms' }}>
              <div>
                <MenuButton 
                  onClick={handleMenuClick}
                  variant="contained"
                >
                  Discover Our Full Menu
                </MenuButton>
              </div>
            </Zoom>
            
            {/* Subtle text below button */}
            <Fade in timeout={800} style={{ transitionDelay: '700ms' }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#3d2400ff',
                  opacity: 0.8,
                  mt: 2,
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                }}
              >
                Explore our complete collection of authentic flavors
              </Typography>
            </Fade>
          </Box>
        </ScrollAnimation>
      </Container>
    </Box>
  );
};

export default HighlightsSection;