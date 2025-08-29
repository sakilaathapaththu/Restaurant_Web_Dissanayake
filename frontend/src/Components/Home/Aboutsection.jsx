import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Card,
  CardMedia,
  Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import Inside1 from '../../Asset/images/Inside1.jpg';
import Inside2 from '../../Asset/images/Inside2.jpg';

// Create custom theme matching your website
const restaurantTheme = createTheme({
  palette: {
    primary: {
      main: '#fda021',
      light: '#fdb551',
      dark: '#e6900f',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#8b4513',
      light: '#a0623d',
      dark: '#6b2f0a'
    },
    background: {
      default: '#fff8f0',
      paper: '#ffffff'
    },
    text: {
      primary: '#3c1300',
      secondary: '#8d6e53'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 300,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontWeight: 400,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontWeight: 400
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.8,
      fontWeight: 300
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.7
    }
  }
});

// Minimal styled components
const StyledCard = styled(Card)({
  borderRadius: '12px',
  overflow: 'hidden',
  height: '100%',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)'
  }
});

const AccentDivider = styled(Divider)(({ theme }) => ({
  width: '60px',
  height: '3px',
  backgroundColor: theme.palette.primary.main,
  marginBottom: '24px'
}));

// Statistics component - minimalistic design
const StatCard = ({ number, label }) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 3, sm: 4 },
        transition: 'all 0.2s ease',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 200,
          color: 'primary.main',
          mb: { xs: 1, md: 1.5 },
          fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem', lg: '3.5rem' },
          lineHeight: 1,
          letterSpacing: '-0.02em'
        }}
      >
        {number}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
          fontWeight: 300,
          lineHeight: 1.3,
          letterSpacing: '0.3px',
          textAlign: 'center'
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

// Image component
const ImageCard = ({ src, alt, gridArea }) => {
  return (
    <StyledCard sx={{ gridArea, height: { xs: '250px', sm: '100%' } }}>
      <CardMedia
        component="img"
        image={src}
        alt={alt}
        sx={{
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      />
    </StyledCard>
  );
};

const AboutUsSection = () => {
  return (
    <ThemeProvider theme={restaurantTheme}>
      <Box
        component="section"
        sx={{
          backgroundColor: 'background.default',
          py: { xs: 6, sm: 8, md: 12 },
          px: { xs: 2, sm: 0 }
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Header Section */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: { xs: 4, sm: 6, md: 10 },
            px: { xs: 2, sm: 0 }
          }}>
            <Chip
              label="Our Restaurant"
              sx={{
                backgroundColor: 'transparent',
                color: 'primary.main',
                border: `1px solid ${restaurantTheme.palette.primary.main}40`,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 500,
                letterSpacing: { xs: '1px', sm: '2px' },
                textTransform: 'uppercase',
                mb: { xs: 1.5, sm: 2 },
                px: { xs: 2, sm: 3 },
                py: 1
              }}
            />
            
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem', lg: '4rem' },
                lineHeight: 1.1,
                color: 'text.primary',
                mb: { xs: 1, sm: 2 },
                px: { xs: 1, sm: 0 }
              }}
            >
              Taste with Tradition
            </Typography>
            
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.4rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                fontWeight: 600,
                color: 'primary.main',
                lineHeight: 1.2,
                px: { xs: 1, sm: 0 }
              }}
            >
              Sri Lankan Flavors, Freshly Made
            </Typography>
          </Box>

          {/* Main Content Grid */}
          <Grid 
            container 
            spacing={{ xs: 3, sm: 4, md: 8, lg: 10 }} 
            alignItems="flex-start" 
            sx={{ mb: { xs: 6, sm: 8, md: 12 } }}
          >
            {/* Content Section */}
            <Grid item xs={12} md={6}>
              <Box sx={{ px: { xs: 2, sm: 0 } }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.8rem', lg: '2rem' },
                    lineHeight: 1.3,
                    color: 'text.primary',
                    mb: { xs: 2, md: 3 },
                    fontWeight: 500
                  }}
                >
                  From Our Chefs to You
                </Typography>
                
                <AccentDivider />
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    mb: { xs: 2, md: 3 },
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.125rem' },
                    lineHeight: { xs: 1.6, md: 1.8 }
                  }}
                >
                  At Dissanayake Restaurant and Bakers, every dish is more than food-it is a story of Sri Lankan
                  flavors, tradition, and care. Our chefs mix local spices, family recipes, and new ideas to create
                  meals and baked treats that bring joy to every table.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    lineHeight: { xs: 1.5, md: 1.7 }
                  }}
                >
                  We celebrate our culture through food, from hearty rice and curry to fresh breads and sweets. 
                  With warm service and honest ingredients, we want every guest to feel the heart of 
                  Sri Lanka in every bite.
                </Typography>
              </Box>
            </Grid>

            {/* Image Grid Section */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: { xs: 4, md: 0 } }}>
                {/* Mobile Layout - Stack Images */}
                <Box
                  sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& > *': { mb: 2 }
                  }}
                >
                  <ImageCard src={Inside1} alt="Restaurant Interior 1" />
                  <ImageCard src={Inside2} alt="Restaurant Interior 2" />
                  <Paper
                    elevation={0}
                    sx={{
                      background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}08)`,
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 3,
                      textAlign: 'center',
                      minHeight: '120px'
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 300,
                        color: 'text.primary',
                        mb: 1
                      }}
                    >
                      Since 2020
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem'
                      }}
                    >
                      Serving Excellence
                    </Typography>
                  </Paper>
                </Box>

                {/* Tablet and Desktop Layout - Grid */}
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'grid' },
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '1fr 1fr',
                    gap: 3,
                    height: { sm: '400px', md: '500px' },
                    gridTemplateAreas: `
                      "main side1"
                      "main side2"
                    `
                  }}
                >
                  <ImageCard
                    src={Inside1}
                    alt="Restaurant Interior 1"
                    gridArea="main"
                  />
                  
                  <ImageCard
                    src={Inside2}
                    alt="Restaurant Interior 2"
                    gridArea="side1"
                  />
                  
                  <Paper
                    elevation={0}
                    sx={{
                      gridArea: 'side2',
                      background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}08)`,
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 4,
                      textAlign: 'center',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { sm: '1.8rem', md: '2rem' },
                        fontWeight: 300,
                        color: 'text.primary',
                        mb: 1
                      }}
                    >
                      Since 2020
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontSize: '0.875rem'
                      }}
                    >
                      Serving Excellence
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AboutUsSection;