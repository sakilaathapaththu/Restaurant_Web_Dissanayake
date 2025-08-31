// src/Components/ScrollToTopButton.jsx
import React, { useState, useEffect } from 'react';
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledFab = styled(Fab)(({ theme }) => ({
position: 'fixed',
bottom: theme.spacing(9),
right: theme.spacing(3),
backgroundColor: '#fda021',
color: '#2c1000',
boxShadow: '0 8px 32px rgba(253, 160, 33, 0.3)',
zIndex: 1000,
'&:hover': {
    backgroundColor: '#e8911d',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(253, 160, 33, 0.4)',
},
'&:active': {
    transform: 'translateY(0px)',
    boxShadow: '0 6px 24px rgba(253, 160, 33, 0.3)',
},
transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
width: 56,
height: 56,
'& .MuiSvgIcon-root': {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease-in-out',
},
'&:hover .MuiSvgIcon-root': {
    transform: 'translateY(-1px)',
},
}));

const ScrollToTopButton = () => {
const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 300px
const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 300,
});

useEffect(() => {
    setIsVisible(trigger);
}, [trigger]);

const scrollToTop = () => {
    window.scrollTo({
    top: 0,
    behavior: 'smooth'
    });
};

return (
    <Zoom in={isVisible} timeout={300}>
    <StyledFab
        onClick={scrollToTop}
        size="large"
        aria-label="scroll back to top"
        role="button"
    >
        <KeyboardArrowUp />
    </StyledFab>
    </Zoom>
);
};

export default ScrollToTopButton;