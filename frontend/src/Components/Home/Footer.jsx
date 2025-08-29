import React, { useState, useEffect } from 'react';
import {
Box,
Container,
Typography,
Grid,
IconButton,
Link,
useTheme,
useMediaQuery,
Fade,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
Instagram,
Facebook,
Phone,
Email,
LocationOn,
AccessTime,
Restaurant,
} from '@mui/icons-material';

// Custom TikTok Icon Component
const TikTokIcon = () => (
<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
</svg>
);

// Custom WhatsApp Icon Component
const WhatsAppIcon = () => (
<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
</svg>
);

// Subtle professional animations
const gentleShimmer = keyframes`
0% {
    background-position: -200px 0;
}
100% {
    background-position: calc(200px + 100%) 0;
}
`;

const softGlow = keyframes`
0%, 100% {
    text-shadow: 0 0 5px rgba(253, 160, 33, 0.3);
}
50% {
    text-shadow: 0 0 10px rgba(253, 160, 33, 0.5);
}
`;

// Clean, professional footer container
const FooterContainer = styled(Box)({
backgroundColor: '#2c1000',
color: '#e8d5c4',
borderTop: '1px solid rgba(253, 160, 33, 0.2)',
});

const FooterSection = styled(Box)({
padding: '60px 0 30px 0',
'@media (max-width: 768px)': {
    padding: '40px 0 20px 0',
},
});

const SectionTitle = styled(Typography)({
color: '#fda021',
fontWeight: 600,
fontSize: '1.2rem',
marginBottom: '20px',
position: 'relative',
'&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-6px',
    left: 0,
    width: '40px',
    height: '2px',
    backgroundColor: '#fda021',
},
});

const FooterText = styled(Typography)({
color: '#e8d5c4',
fontSize: '0.9rem',
lineHeight: 1.6,
marginBottom: '12px',
opacity: 0.9,
'&:hover': {
    opacity: 1,
},
});

const BrandSection = styled(Box)({
display: 'flex',
alignItems: 'center',
marginBottom: '20px',
});

const BrandIcon = styled(Restaurant)({
color: '#fda021',
fontSize: '2rem',
marginRight: '12px',
});

const BrandText = styled(Typography)({
color: '#fda021',
fontWeight: 700,
fontSize: '1.4rem',
});

const SocialIconButton = styled(IconButton)({
backgroundColor: 'rgba(253, 160, 33, 0.1)',
color: '#fda021',
width: '40px',
height: '40px',
margin: '0 8px 8px 0',
border: '1px solid rgba(253, 160, 33, 0.2)',
transition: 'all 0.3s ease',
'&:hover': {
    backgroundColor: 'rgba(253, 160, 33, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(253, 160, 33, 0.3)',
},
});

const ContactItem = styled(Box)({
display: 'flex',
alignItems: 'flex-start',
marginBottom: '16px',
'&:hover': {
    '& .contact-icon': {
    color: '#fda021',
    },
},
});

const ContactIcon = styled(Box)({
minWidth: '20px',
height: '20px',
marginRight: '12px',
marginTop: '2px',
color: 'rgba(253, 160, 33, 0.7)',
transition: 'color 0.3s ease',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
});

const BlackCodeLink = styled(Link)({
color: '#fda021',
textDecoration: 'none',
fontWeight: 700,
fontSize: '1rem',
cursor: 'pointer',
position: 'relative',
background: 'linear-gradient(45deg, #fda021, #ffb84d, #fda021)',
backgroundSize: '200% auto',
backgroundClip: 'text',
WebkitBackgroundClip: 'text',
WebkitTextFillColor: 'transparent',
animation: `${gentleShimmer} 3s ease-in-out infinite`,
transition: 'all 0.3s ease',
'&:hover': {
    transform: 'scale(1.05)',
    WebkitTextFillColor: '#ffffff',
    animation: `${softGlow} 1s ease-in-out infinite`,
},
});

const CopyrightSection = styled(Box)({
borderTop: '1px solid rgba(253, 160, 33, 0.2)',
paddingTop: '20px',
paddingBottom: '20px',
marginTop: '40px',
});

const RestaurantFooter = () => {
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
    setIsVisible(true);
}, []);

const handleSocialClick = (platform) => {
    const urls = {
    instagram: 'https://instagram.com/dissanyakebakers',
    facebook: 'https://facebook.com/dissanyakebakers',
    tiktok: 'https://tiktok.com/@dissanyakebakers',
    whatsapp: 'https://wa.me/94771234567'
    };
    
    window.open(urls[platform], '_blank', 'noopener,noreferrer');
};

const handleBlackCodeClick = () => {
    window.open('https://www.blackcodedev.com', '_blank', 'noopener,noreferrer');
};

return (
    <FooterContainer component="footer">
    <Container maxWidth="xl">
        <FooterSection>
        <Fade in={isVisible} timeout={800}>
            <Grid container spacing={4}>
              {/* Restaurant Info */}
            <Grid item xs={12} sm={6} md={3}>
                <Box>
                <BrandSection>
                    <BrandIcon />
                    <BrandText>
                    Dissanyake Restaurant And Bakers
                    </BrandText>
                </BrandSection>
                <FooterText>
                    Experience authentic Sri Lankan cuisine and traditional baked goods crafted with passion and quality ingredients.
                </FooterText>
                </Box>
            </Grid>

              {/* Contact Information */}
            <Grid item xs={12} sm={6} md={3}>
                <Box>
                <SectionTitle>Contact Us</SectionTitle>
                
                <ContactItem>
                    <ContactIcon className="contact-icon">
                    <LocationOn fontSize="small" />
                    </ContactIcon>
                    <FooterText sx={{ mb: 0 }}>
                    No. 20,<br />
                    Colombo Rd, Pothuhera
                    </FooterText>
                </ContactItem>

                <ContactItem>
                    <ContactIcon className="contact-icon">
                    <Phone fontSize="small" />
                    </ContactIcon>
                    <FooterText sx={{ mb: 0 }}>
                    +94 77 750 6319
                    </FooterText>
                </ContactItem>

                <ContactItem>
                    <ContactIcon className="contact-icon">
                    <Email fontSize="small" />
                    </ContactIcon>
                    <FooterText sx={{ mb: 0 }}>
                    info@dissanyakebakers.com
                    </FooterText>
                </ContactItem>
                </Box>
            </Grid>

              {/* Opening Hours */}
            <Grid item xs={12} sm={6} md={3}>
                <Box>
                <SectionTitle>Opening Hours</SectionTitle>
                
                <ContactItem>
                    <ContactIcon>
                    <AccessTime fontSize="small" />
                    </ContactIcon>
                    <Box>
                    <FooterText sx={{ mb: 1, fontWeight: 600, color: '#fda021' }}>
                        Daily Hours
                    </FooterText>
                    <FooterText sx={{ mb: 1 }}>Monday - Saturday</FooterText>
                    <FooterText sx={{ mb: 1, opacity: 0.8 }}>7:00 AM - 10:00 PM</FooterText>
                    <FooterText sx={{ mb: 1 }}>Sunday</FooterText>
                    <FooterText sx={{ mb: 0, opacity: 0.8 }}>7:00 AM - 10:00 PM</FooterText>
                    </Box>
                </ContactItem>
                </Box>
            </Grid>

              {/* Social Media & Developer */}
            <Grid item xs={12} sm={6} md={3}>
                <Box>
                <SectionTitle>Follow Us</SectionTitle>
                
                <Box sx={{ mb: 3 }}>
                    <SocialIconButton
                    onClick={() => handleSocialClick('instagram')}
                    aria-label="Instagram"
                    >
                    <Instagram fontSize="small" />
                    </SocialIconButton>
                    
                    <SocialIconButton
                    onClick={() => handleSocialClick('facebook')}
                    aria-label="Facebook"
                    >
                    <Facebook fontSize="small" />
                    </SocialIconButton>
                    
                    <SocialIconButton
                    onClick={() => handleSocialClick('tiktok')}
                    aria-label="TikTok"
                    >
                    <TikTokIcon />
                    </SocialIconButton>
                    
                    <SocialIconButton
                    onClick={() => handleSocialClick('whatsapp')}
                    aria-label="WhatsApp"
                    >
                    <WhatsAppIcon />
                    </SocialIconButton>
                </Box>

                <Box>
                    <Typography
                    sx={{ 
                        color: 'rgba(232, 213, 196, 0.8)', 
                        fontSize: '0.85rem',
                        mb: 1
                    }}
                    >
                    Website Developed by
                    </Typography>
                    <BlackCodeLink
                    onClick={handleBlackCodeClick}
                    role="button"
                    tabIndex={0}
                    >
                    BlackCode Devs
                    </BlackCodeLink>
                </Box>
                </Box>
            </Grid>
            </Grid>
        </Fade>

          {/* Copyright Section */}
        <Fade in={isVisible} timeout={1000} style={{ transitionDelay: '0.2s' }}>
            <CopyrightSection>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item xs={12} md={8}>
                <Typography
                    variant="body2"
                    sx={{
                    color: 'rgba(232, 213, 196, 0.8)',
                    fontSize: '0.85rem',
                    textAlign: isMobile ? 'center' : 'left',
                    mb: isMobile ? 2 : 0,
                    }}
                >
                    © {new Date().getFullYear()} Dissanyake Restaurant & Bakers. All rights reserved.
                </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                <Box
                    sx={{
                    display: 'flex',
                    justifyContent: isMobile ? 'center' : 'flex-end',
                    alignItems: 'center',
                    gap: 1.5,
                    }}
                >
                    <Typography
                    sx={{ 
                        color: 'rgba(232, 213, 196, 0.7)', 
                        fontSize: '0.8rem'
                    }}
                    >
                    Made with ❤️ by
                    </Typography>
                    <BlackCodeLink
                    onClick={handleBlackCodeClick}
                    sx={{ fontSize: '0.9rem' }}
                    >
                    BlackCode Devs
                    </BlackCodeLink>
                </Box>
                </Grid>
            </Grid>
            </CopyrightSection>
        </Fade>
        </FooterSection>
    </Container>
    </FooterContainer>
);
};

export default RestaurantFooter;