import React, { useState } from 'react';
import {
  AppBar, Box, Toolbar, IconButton, Typography,
  Menu, Container, Avatar, Button, Tooltip, MenuItem,
  useTheme, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext'; // adjust path if needed
// import API, { IMAGE_BASE_URL } from "../../Utils/api";
import Logo from '../../Asset/images/Logo.png'; // Ensure you have a logo image in this path

const pages = ['Home', 'Menu', 'About', 'Contact Us'];
const pageRoutes = {
  Home: '/',
  Menu: '/menu',
  'Contact Us': '/contactus',
  'About': '/aboutus',
};

export default function HomepageNavbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth() || { user: null, logout: () => {} };

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

  const handleNavigate = (page) => {
    const route = pageRoutes[page];
    if (route) {
      navigate(route);
    }
    handleCloseNavMenu();
  };

  const handleUserAction = (action) => {
    if (action === 'logout') {
      logout();
    } else if (action === 'profile') {
      navigate('/profile');
    }
    handleCloseUserMenu();
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: '#3c1300',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(253, 160, 33, 0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '110px', maxHeight: '110px', overflow: 'hidden' }}>
          {/* Desktop Logo - Left Aligned */}
          <Box 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center',
              mr: -10
            }}
          >
            <img
              src={Logo}
              alt="Restaurant Logo"
              style={{
                height: '200px',
                width: 'auto',
                marginRight: '10px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            />
          </Box>

          {/* Mobile Menu Icon - Left */}
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#fda021' }}
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
                  mt: 1
                }
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page} 
                  onClick={() => handleNavigate(page)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(253, 160, 33, 0.1)'
                    }
                  }}
                >
                  <Typography 
                    textAlign="center"
                    sx={{ 
                      color: '#fda021',
                      fontWeight: 500,
                      fontSize: '1rem'
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
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img
              src={Logo}
              alt="Restaurant Logo"
              style={{
                height: '150px',
                width: 'auto',
                marginRight: '8px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            />
          </Box>

          {/* Desktop Navigation Links */}
          <Box 
            sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              gap: 1
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
                  fontSize: '1rem',
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  borderRadius: '25px',
                  transition: 'all 0.3s ease',
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

          {/* User Profile Section */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ p: 0 }}
                  >
                    <Avatar 
                      sx={{ 
                        backgroundColor: '#fda021',
                        color: '#3c1300',
                        width: 40,
                        height: 40
                      }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: {
                      backgroundColor: '#3c1300',
                      border: '1px solid #fda021',
                      borderRadius: '8px'
                    }
                  }}
                >
                  <MenuItem onClick={() => handleUserAction('profile')}>
                    <Typography 
                      textAlign="center"
                      sx={{ color: '#fda021', fontWeight: 500 }}
                    >
                      Profile
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleUserAction('logout')}>
                    <Typography 
                      textAlign="center"
                      sx={{ color: '#fda021', fontWeight: 500 }}
                    >
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                sx={{
                  color: '#fda021',
                  fontWeight: 600,
                  textTransform: 'none',
                  border: '2px solid #fda021',
                  borderRadius: '25px',
                  px: 3,
                  py: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#fda021',
                    color: '#3c1300',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}