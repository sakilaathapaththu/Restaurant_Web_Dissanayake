import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import {
  Box,
  Container,
  Typography,
  Button,
  Chip
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Create custom theme with your specified colors
const contactTheme = createTheme({
  palette: {
    primary: {
      main: '#fda021',
      light: '#fdb651',
      dark: '#e6900f',
      contrastText: '#2c1000'
    },
    secondary: {
      main: '#2c1000',
      light: '#4a2f20',
      dark: '#1a0800'
    },
    background: {
      default: '#FFF5EE',
      paper: '#ffffff'
    },
    text: {
      primary: '#2c1000',
      secondary: '#8b6914'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontWeight: 500,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontWeight: 500
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    }
  }
});

// Cards container with perfect flex layout
const CardsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  marginBottom: '40px',
  justifyContent: 'center',
  alignItems: 'stretch', // All cards same height
  flexWrap: 'nowrap', // Keep in one row on desktop
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'stretch', // Full width on mobile
    flexWrap: 'nowrap'
  }
}));

// Perfect contact card with fixed dimensions
const ContactCard = styled(Box)(({ theme }) => ({
  flex: '1 1 0', // Equal flex basis for identical widths
  minWidth: '280px',
  maxWidth: '320px',
  height: '220px', // Fixed height for all cards
  padding: '24px',
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: '16px',
  border: `2px solid ${theme.palette.primary.main}20`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 20px rgba(44, 16, 0, 0.08)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}08, transparent)`,
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 12px 40px rgba(253, 160, 33, 0.25)`,
    borderColor: theme.palette.primary.main,
    '&::before': {
      opacity: 1
    },
    '& .contact-icon': {
      transform: 'scale(1.2) rotate(5deg)',
      color: theme.palette.primary.dark
    },
    '& .contact-title': {
      color: theme.palette.primary.main
    }
  },
  '&:active': {
    transform: 'translateY(-4px) scale(0.98)'
  },
  [theme.breakpoints.down('sm')]: {
    flex: 'none', // Remove flex on mobile
    width: '100%',
    maxWidth: 'none', // Remove max width restriction
    minWidth: 'auto', // Remove min width restriction
    height: '160px', // Smaller height for mobile
    padding: '20px',
    margin: '0' // Remove any margin
  }
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: `${theme.palette.primary.main}15`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px auto',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  [theme.breakpoints.down('sm')]: {
    width: '48px',
    height: '48px',
    marginBottom: '12px'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '16px 40px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  letterSpacing: '0.5px',
  boxShadow: `0 6px 20px ${theme.palette.primary.main}30`,
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${theme.palette.background.paper}40, transparent)`,
    transition: 'left 0.6s ease'
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 12px 30px ${theme.palette.primary.main}40`,
    '&::before': {
      left: '100%'
    },
    '& .arrow-icon': {
      transform: 'translateX(6px) rotate(45deg)'
    }
  },
  '&:active': {
    transform: 'translateY(-1px)'
  }
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '48px',
  position: 'relative'
}));

const AccentLine = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '4px',
  backgroundColor: theme.palette.primary.main,
  margin: '16px auto 24px auto',
  borderRadius: '2px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '12px',
    height: '12px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%'
  }
}));

const ContactGuideSection = ({ onNavigateToContact }) => {
  const navigate = useNavigate(); // Add this hook

  const contactInfo = [
    {
      icon: <PhoneIcon className="contact-icon" sx={{ fontSize: '28px', color: 'primary.main' }} />,
      title: 'Call Us',
      content: '+94 77 750 6319',
      subContent: 'Available 7:00 AM - 10:00 PM Daily',
      action: 'phone'
    },
    {
      icon: <EmailIcon className="contact-icon" sx={{ fontSize: '28px', color: 'primary.main' }} />,
      title: 'Email Us',
      content: 'info@dissanyakebakers.com',
      subContent: 'Quick response within 24 hours',
      action: 'email'
    },
    {
      icon: <LocationOnIcon className="contact-icon" sx={{ fontSize: '28px', color: 'primary.main' }} />,
      title: 'Visit Us',
      content: 'No. 20, Colombo Road',
      subContent: 'Pothuhera, Kurunegala',
      action: 'location'
    }
  ];

  const handleContactClick = (type, value) => {
    const actions = {
      phone: () => window.open(`tel:${value.replace(/\s/g, '')}`),
      email: () => window.open(`mailto:${value}`),
      location: () => window.open('https://maps.app.goo.gl/r5CYR78bMnCQiN6Y8')
    };
    
    actions[type]?.();
  };

  // Add this function to handle navigation to ContactBooking page
  const handleNavigateToContact = () => {
    navigate('/contact'); // This matches your route in App.js
  };

  return (
    <ThemeProvider theme={contactTheme}>
      <Box
        component="section"
        sx={{
          backgroundColor: 'background.default',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle animated background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 30%, ${contactTheme.palette.primary.main}08 0%, transparent 50%), 
                        radial-gradient(circle at 80% 70%, ${contactTheme.palette.primary.main}05 0%, transparent 50%)`,
            animation: 'float 8s ease-in-out infinite',
            zIndex: 0,
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-10px)' }
            }
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <SectionHeader>
            <Chip
              label="Get In Touch"
              variant="outlined"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                px: 2,
                py: 0.5,
                '&:hover': {
                  backgroundColor: `${contactTheme.palette.primary.main}10`
                }
              }}
            />
            
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                lineHeight: 1.2,
                color: 'text.primary',
                mt: 2,
                mb: 1
              }}
            >
              Ready to Experience{' '}
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Authentic Sri Lankan Cuisine?
              </Box>
            </Typography>

            <AccentLine />
            
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '0.95rem', md: '1.1rem' },
                maxWidth: '520px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Connect with us for reservations, inquiries, or to discover the finest traditional flavors.
            </Typography>
          </SectionHeader>

          {/* Contact Cards - Perfect Equal Layout */}
          <CardsContainer>
            {contactInfo.map((info, index) => (
              <ContactCard
                key={index}
                onClick={() => handleContactClick(info.action, info.content)}
              >
                <IconContainer>
                  {info.icon}
                </IconContainer>
                
                <Typography
                  className="contact-title"
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: { xs: 0.5, sm: 1 },
                    transition: 'color 0.3s ease'
                  }}
                >
                  {info.title}
                </Typography>
                
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    fontWeight: 500,
                    color: 'text.primary',
                    mb: { xs: 0.25, sm: 0.5 },
                    lineHeight: 1.4,
                    wordBreak: 'break-word'
                  }}
                >
                  {info.content}
                </Typography>
                
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    color: 'text.secondary',
                    lineHeight: 1.3
                  }}
                >
                  {info.subContent}
                </Typography>
              </ContactCard>
            ))}
          </CardsContainer>

          {/* Call to Action */}
          <Box sx={{ 
            textAlign: 'center',
            pt: 2
          }}>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 3,
                fontSize: { xs: '0.95rem', md: '1rem' },
                lineHeight: 1.5,
                fontWeight: 400
              }}
            >
              Questions about our menu, reservations, or special events?
            </Typography>
            
            <StyledButton
              variant="contained"
              size="large"
              onClick={handleNavigateToContact} // Changed this line
              endIcon={
                <ArrowForwardIcon 
                  className="arrow-icon"
                  sx={{ 
                    fontSize: '18px',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }} 
                />
              }
              sx={{
                backgroundColor: 'secondary.main',
                color: 'primary.main',
                fontSize: '1rem',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                  color: 'primary.light'
                }
              }}
            >
              Contact Us Today
            </StyledButton>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 2,
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontStyle: 'italic'
              }}
            >
              Click any card above for instant contact
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ContactGuideSection;