import React, { useState, useEffect, useRef } from "react";
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
  Select,
  MenuItem,
  FormControl,
  Button,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import API from "../../Utils/api";
// fallback image (replace with your asset)
import fallbackImage from "../../Asset/images/foods/chicken-fried-rice.jpg";

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
    background: `radial-gradient(circle at 10% 20%, rgba(253, 160, 33, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, rgba(253, 160, 33, 0.05) 0%, transparent 50%),
      linear-gradient(135deg, rgba(253, 160, 33, 0.02) 0%, transparent 50%)`,
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
  minWidth: '340px',
  width: '340px',
  height: 'auto',
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
  display: 'flex',
  flexDirection: 'column',
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
    minWidth: '320px',
    width: '320px',
    margin: '0 14px',
  },
  '@media (max-width: 768px)': {
    minWidth: '300px',
    width: '300px',
    margin: '0 12px',
    borderRadius: '20px',
  },
  '@media (max-width: 480px)': {
    minWidth: '280px',
    width: '280px',
    margin: '0 10px',
    borderRadius: '16px',
  },
  '@media (max-width: 360px)': {
    minWidth: '260px',
    width: '260px',
    margin: '0 8px',
  },
});

const DishImage = styled(CardMedia)({
  height: '220px',
  position: 'relative',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '@media (max-width: 1024px)': {
    height: '200px',
  },
  '@media (max-width: 768px)': {
    height: '180px',
  },
  '@media (max-width: 480px)': {
    height: '160px',
  },
  '@media (max-width: 360px)': {
    height: '140px',
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

const PortionSelector = styled(FormControl)({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(253, 160, 33, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(253, 160, 33, 0.08)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#fda021',
      },
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(253, 160, 33, 0.1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#fda021',
        borderWidth: '2px',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(253, 160, 33, 0.3)',
    },
  },
  '& .MuiSelect-select': {
    padding: '12px 16px',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#3c1300',
  },
  '& .MuiInputLabel-root': {
    color: '#3c1300',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#fda021',
    },
  },
});

const PortionOption = styled(MenuItem)({
  padding: '12px 16px',
  '&:hover': {
    backgroundColor: 'rgba(253, 160, 33, 0.08)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(253, 160, 33, 0.15)',
    '&:hover': {
      backgroundColor: 'rgba(253, 160, 33, 0.2)',
    },
  },
});

const PriceDisplay = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  backgroundColor: 'rgba(253, 160, 33, 0.05)',
  borderRadius: '12px',
  border: '1px solid rgba(253, 160, 33, 0.2)',
});

// Fixed bottom container for portion/price
const FixedBottomSection = styled(Box)({
  marginTop: 'auto',
  padding: '16px 24px',
  backgroundColor: '#ffffff',
  borderTop: '1px solid rgba(253, 160, 33, 0.15)',
  '@media (max-width: 768px)': {
    padding: '14px 20px',
  },
  '@media (max-width: 480px)': {
    padding: '12px 16px',
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
  const [dishes, setDishes] = useState([]);
  const [selectedPortions, setSelectedPortions] = useState({});
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // 🔥 Fetch dishes from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await API.get("/menu-items");
        if (res.data.success) {
          const foods = res.data.data.map((item) => ({
            id: item._id,
            menuId: item.menuId,
            name: item.name,
            description: item.description || "",
            category: item.categoryName || "Uncategorized",
            image: fallbackImage, // placeholder for now
            portions: item.portions || [],
            hasMultiplePortions: item.portions && item.portions.length > 1,
          }));
          setDishes(foods);

          // Initialize selected portions for each dish
          const initialSelections = {};
          foods.forEach((dish) => {
            if (dish.portions && dish.portions.length > 0) {
              initialSelections[dish.id] = 0; // Default to first portion
            }
          });
          setSelectedPortions(initialSelections);
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
      }
    };

    fetchMenuItems();
  }, []);

  // Handle portion selection change
  const handlePortionChange = (dishId, portionIndex) => {
    setSelectedPortions(prev => ({
      ...prev,
      [dishId]: portionIndex
    }));
  };

  // Get current price for a dish
  const getCurrentPrice = (dish) => {
    if (!dish.portions || dish.portions.length === 0) return "Price not available";
    const selectedIndex = selectedPortions[dish.id] || 0;
    const portion = dish.portions[selectedIndex];
    return `LKR ${portion.finalPrice || portion.price || 0}`;
  };

  // Get current portion label
  const getCurrentPortionLabel = (dish) => {
    if (!dish.portions || dish.portions.length === 0) return "";
    const selectedIndex = selectedPortions[dish.id] || 0;
    const portion = dish.portions[selectedIndex];
    return portion.label || "";
  };

  // ✅ slider setup
  const extendedDishes = [...dishes, ...dishes, ...dishes];
  const cardWidth = 372; // 340px + 32px margin
  const totalOriginalWidth = dishes.length * cardWidth;

  useEffect(() => {
    if (!isHovered && !isTransitioning && dishes.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTranslate((prev) => {
          const newTranslate = prev - cardWidth;
          if (Math.abs(newTranslate) >= totalOriginalWidth) {
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
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, isTransitioning, cardWidth, totalOriginalWidth, dishes]);

  const handlePrevious = () => {
    if (isTransitioning) return;
    setCurrentTranslate((prev) => {
      const newTranslate = prev + cardWidth;
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
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <ScrollAnimation>
          <Box>
            <SectionTitle variant="h2" component="h2">
              Culinary Collection
            </SectionTitle>
            <SectionSubtitle variant="h6">
              Experience our finest dish collection, where every dish tells a story of passion, precision, and exceptional flavor profiles
            </SectionSubtitle>
          </Box>
        </ScrollAnimation>

        {/* Dishes Slider */}
        <ScrollAnimation delay={200}>
          <SliderContainer
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
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

            <SliderTrack
              ref={sliderRef}
              sx={{
                transform: `translateX(${currentTranslate}px)`,
                transition: isTransitioning
                  ? "none"
                  : "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {extendedDishes.map((dish, index) => (
                <DishCard key={`${dish.id}-${index}`}>
                  <Box sx={{ position: "relative" }}>
                    <DishImage
                      className="dish-image"
                      image={dish.image}
                      title={dish.name}
                    />
                    <ImageOverlay className="dish-overlay" />

                    {/* Price Chip - Top Right */}
                    <PriceChip label={getCurrentPrice(dish)} />
                  </Box>

                  <CardContent
                    className="dish-content"
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      transition: "transform 0.3s ease",
                      "@media (max-width: 768px)": {
                        p: 2,
                      },
                    }}
                  >
                    {/* Category Chip */}
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={dish.category}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(253, 160, 33, 0.1)",
                          color: "#3c1300",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    {/* Dish Name */}
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        color: "#3c1300",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        mb: 1,
                        lineHeight: 1.3,
                      }}
                    >
                      {dish.name}
                    </Typography>

                    {/* Menu ID */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#3c1300",
                        opacity: 0.6,
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      {dish.menuId}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#3c1300",
                        opacity: 0.8,
                        lineHeight: 1.6,
                        fontSize: "0.9rem",
                        mb: 2,
                      }}
                    >
                      {dish.description}
                    </Typography>
                  </CardContent>

                  {/* Fixed Bottom Section for Portion/Price */}
                  <FixedBottomSection>
                    {dish.hasMultiplePortions ? (
                      <PortionSelector size="small">
                        <Select
                          value={selectedPortions[dish.id] || 0}
                          onChange={(e) => handlePortionChange(dish.id, e.target.value)}
                          displayEmpty
                          IconComponent={ExpandMoreIcon}
                          sx={{
                            fontSize: '0.9rem',
                            '& .MuiSelect-icon': { color: '#fda021' }
                          }}
                        >
                          {dish.portions.map((portion, portionIndex) => (
                            <PortionOption key={portionIndex} value={portionIndex}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <Typography sx={{ fontWeight: 500, color: '#3c1300' }}>
                                  {portion.label}
                                </Typography>
                                <Typography sx={{ fontWeight: 700, color: '#fda021' }}>
                                  LKR {portion.finalPrice || portion.price}
                                </Typography>
                              </Box>
                            </PortionOption>
                          ))}
                        </Select>
                      </PortionSelector>
                    ) : (
                      // Single portion display
                      <PriceDisplay>
                        <Typography sx={{ fontWeight: 500, color: '#3c1300', fontSize: '0.9rem' }}>
                          {getCurrentPortionLabel(dish) || "Standard"}
                        </Typography>
                        <Typography sx={{ fontWeight: 700, color: '#fda021', fontSize: '1.1rem' }}>
                          {getCurrentPrice(dish)}
                        </Typography>
                      </PriceDisplay>
                    )}
                  </FixedBottomSection>
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
                transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                fontSize: "1.3rem",
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