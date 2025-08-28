import React, { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  useTheme, 
  useMediaQuery,
  styled 
} from '@mui/material';

// Import images
import img1 from '../../Asset/images/img1.png';
import img2 from '../../Asset/images/img2.png';

// Styled components for custom styling
const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '500px',
  overflow: 'hidden',
  borderRadius: 0, // Removed rounded corners
  boxShadow: 'none', // Removed shadow for cleaner look
  [theme.breakpoints.down('xl')]: {
    height: '450px',
  },
  [theme.breakpoints.down('lg')]: {
    height: '400px',
  },
  [theme.breakpoints.down('md')]: {
    height: '300px', // Reduced height for better mobile layout
    borderRadius: 0,
  },
  [theme.breakpoints.down('sm')]: {
    height: '250px', // Better proportions for mobile
    borderRadius: 0,
  },
  [theme.breakpoints.down('xs')]: {
    height: '200px', // Cleaner mobile height
  },
  '&:hover .carousel-nav': {
    opacity: 1,
  }
}));

const ImagesContainer = styled(Box)(({ slidecount, currentslide }) => ({
  display: 'flex',
  width: `${slidecount * 100}%`,
  height: '100%',
  transform: `translateX(-${currentslide * (100 / slidecount)}%)`,
  transition: 'transform 1.5s cubic-bezier(0.23, 1, 0.32, 1)', // Smoother, more professional easing
}));

const SlideWrapper = styled(Box)(({ slidecount }) => ({
  width: `${100 / slidecount}%`,
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
}));

const SlideImage = styled('img')(({ theme, iscurrent }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  transition: 'transform 2s cubic-bezier(0.23, 1, 0.32, 1)', // Smoother, longer transition
  transform: iscurrent === 'true' ? 'scale(1.03)' : 'scale(1)', // Slightly more subtle scale
  backgroundColor: '#f5f5f5',
  [theme.breakpoints.down('md')]: {
    objectFit: 'cover',
  },
}));

const NavButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  color: '#333',
  width: 52,
  height: 52,
  opacity: 0,
  transition: 'all 0.3s ease',
  zIndex: 3,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '50%', // Keep circular buttons but remove container radius
  [theme.breakpoints.down('lg')]: {
    width: 48,
    height: 48,
  },
  [theme.breakpoints.down('md')]: {
    width: 36, // Smaller for mobile
    height: 36,
    opacity: 0.8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  [theme.breakpoints.down('sm')]: {
    width: 32, // Even smaller for small screens
    height: 32,
    opacity: 0.9,
  },
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'translateY(-50%) scale(1.05)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
  },
  '&:active': {
    transform: 'translateY(-50%) scale(0.95)',
  },
}));

const DotContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 12,
  zIndex: 3,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(8px)',
  padding: '6px 12px',
  borderRadius: '20px',
  [theme.breakpoints.down('md')]: {
    bottom: 12,
    gap: 10,
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  [theme.breakpoints.down('sm')]: {
    bottom: 8,
    gap: 8,
    padding: '3px 6px',
  },
}));

const Dot = styled(Box)(({ theme, active }) => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: active ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)', // Smoother transition
  transform: active ? 'scale(1.3)' : 'scale(1)', // More pronounced active state
  boxShadow: active ? '0 3px 12px rgba(255, 255, 255, 0.5)' : 'none',
  border: active ? '2px solid rgba(255, 255, 255, 0.9)' : 'none',
  [theme.breakpoints.down('md')]: {
    width: 8,
    height: 8,
  },
  [theme.breakpoints.down('sm')]: {
    width: 6,
    height: 6,
  },
  '&:hover': {
    backgroundColor: active ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
    transform: active ? 'scale(1.3)' : 'scale(1.15)',
  }
}));

const ProgressBar = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 4,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  zIndex: 2,
}));

const ProgressFill = styled(Box)(({ isplaying }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  transformOrigin: 'left',
  animation: isplaying === 'true' ? 'progress 6s linear infinite' : 'none',
  '@keyframes progress': {
    '0%': { transform: 'scaleX(0)' },
    '100%': { transform: 'scaleX(1)' },
  },
}));

// Mobile swipe handler component
const SwipeHandler = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  touchAction: 'pan-y', // Allow vertical scrolling but handle horizontal swipes
});

const HomeCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const images = [
    img1,
    img2
  ];

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Auto-play functionality with longer, more professional timing
  useEffect(() => {
    let interval;
    if (isAutoPlaying && images.length > 1) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % images.length);
      }, 8000); // Slower, more professional timing (8 seconds)
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000); // Longer pause for better UX
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + images.length) % images.length);
    pauseAutoPlay();
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % images.length);
    pauseAutoPlay();
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    pauseAutoPlay();
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
  };

  // Pause auto-play when user hovers (desktop) or touches (mobile)
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsAutoPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsAutoPlaying(true);
    }
  };

  return (
    <CarouselContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Touch handler for mobile swipe */}
      <SwipeHandler
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {/* Images Container */}
      <ImagesContainer 
        slidecount={images.length} 
        currentslide={currentSlide}
      >
        {images.map((image, index) => (
          <SlideWrapper 
            key={index}
            slidecount={images.length}
          >
            <SlideImage
              src={image}
              alt={`Slide ${index + 1}`}
              iscurrent={(currentSlide === index).toString()}
              loading={index === 0 ? 'eager' : 'lazy'} // Optimize loading
            />
            {/* Subtle gradient overlay for better visual depth */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%)',
                opacity: 0.3,
                transition: 'opacity 0.5s ease',
              }}
            />
          </SlideWrapper>
        ))}
      </ImagesContainer>

      {/* Dot Indicators - Only show if more than 1 image */}
      {/* {images.length > 1 && (
        <DotContainer>
          {images.map((_, index) => (
            <Dot
              key={index}
              active={currentSlide === index}
              onClick={() => handleDotClick(index)}
              role="button"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </DotContainer>
      )} */}
    </CarouselContainer>
  );
};

export default HomeCarousel;