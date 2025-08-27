import React, { useState } from 'react';
import {
  AppBar, Box, Toolbar, IconButton, Typography,
  Menu, Container, Avatar, Button, Tooltip, MenuItem,
  useTheme, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
// import API, { IMAGE_BASE_URL } from "../../Utils/api";
import Logo from '../../Asset/images/Logo.png'; // logo image path
import mobilelogo from '../../Asset/images/mobile logo.png'; // logo image path

const pages = ['Home', 'Menu', 'About', 'Contact Us'];

export default function HomepageNavbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = isMobile ? 70 : 110; // Account for fixed navbar height
      const elementPosition = element.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavigate = (page) => {
    handleCloseNavMenu();
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/home' && location.pathname !== '/') {
      navigate('/home');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const sectionId = page.toLowerCase().replace(' ', '');
        if (sectionId === 'contactus') {
          scrollToSection('contact');
        } else {
          scrollToSection(sectionId);
        }
      }, 100);
    } else {
      // We're already on home page, just scroll
      const sectionId = page.toLowerCase().replace(' ', '');
      if (sectionId === 'contactus') {
        scrollToSection('contact');
      } else {
        scrollToSection(sectionId);
      }
    }
  };

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#3c1300',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          borderBottom: '1px solid rgba(253, 160, 33, 0.1)',
          backdropFilter: 'blur(10px)',
          zIndex: theme.zIndex.appBar,
          top: 0,
          left: 0,
          right: 0
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters 
            sx={{ 
              minHeight: { xs: '70px', sm: '85px', md: '95px', lg: '110px' },
              maxHeight: { xs: '70px', sm: '85px', md: '95px', lg: '110px' },
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center'
            }}
          >
          {/* Desktop Layout */}
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              width: '100%',
              alignItems: 'center'
            }}
          >
            {/* Desktop Logo - Left */}
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              <img
                src={mobilelogo}
                alt="Restaurant Logo"
                style={{
                  height: '80px',
                  width: 'auto',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onClick={() => navigate('/')}
              />
            </Box>

            {/* Spacer to push navigation to the right */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Navigation Links - Right Aligned */}
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexShrink: 0
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavigate(page)}
                  sx={{
                    color: '#fda021',
                    display: 'block',
                    fontWeight: 600,
                    fontSize: { md: '1rem', lg: '1.1rem' },
                    textTransform: 'none',
                    px: { md: 2.5, lg: 3 },
                    py: 1.5,
                    borderRadius: '25px',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'rgba(253, 160, 33, 0.1)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Mobile Layout */}
          <Box 
            sx={{ 
              display: { xs: 'flex', md: 'none' },
              width: '100%',
              alignItems: 'center'
            }}
          >
            {/* Mobile Menu Icon - Left */}
            <Box sx={{ flexShrink: 0 }}>
              <IconButton
                size="large"
                aria-label="navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{ 
                  color: '#fda021',
                  p: 1
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    backgroundColor: '#3c1300',
                    border: '1px solid #fda021',
                    borderRadius: '8px',
                    mt: 1,
                    minWidth: '180px'
                  }
                }}
              >
                {pages.map((page) => (
                  <MenuItem 
                    key={page} 
                    onClick={() => handleNavigate(page)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(253, 160, 33, 0.1)'
                      }
                    }}
                  >
                    <Typography 
                      textAlign="left"
                      sx={{ 
                        color: '#fda021',
                        fontWeight: 500,
                        fontSize: '1rem',
                        width: '100%'
                      }}
                    >
                      {page}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Mobile Logo - Center */}
            <Box 
              sx={{ 
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                src={mobilelogo}
                alt="Restaurant Logo"
                style={{
                  height: '60px',
                  width: 'auto',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onClick={() => navigate('/')}
              />
            </Box>

            {/* Mobile Right Spacer (for potential future content) */}
            <Box sx={{ width: '48px', flexShrink: 0 }} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    
    {/* Spacer div to push content below fixed navbar */}
    <Box 
      sx={{ 
        height: { xs: '70px', sm: '85px', md: '95px', lg: '110px' },
        width: '100%'
      }} 
    />
  </>
  );
}