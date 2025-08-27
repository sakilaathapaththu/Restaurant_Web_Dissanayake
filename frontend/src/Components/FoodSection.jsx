import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import FoodCard from './FoodCard';

const FoodSection = ({ title, foods, showSeeAll = true }) => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <Box sx={{ py: 3, backgroundColor: 'white' }}>
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            px: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showSeeAll && (
              <Button
                variant="text"
                sx={{
                  color: '#06c167',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                See all
              </Button>
            )}
            
            {/* Navigation Arrows */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button
                onClick={() => scroll('left')}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  borderColor: '#ddd',
                  color: '#666',
                  '&:hover': {
                    borderColor: '#06c167',
                    color: '#06c167',
                  },
                }}
              >
                <ChevronLeft />
              </Button>
              <Button
                onClick={() => scroll('right')}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  borderColor: '#ddd',
                  color: '#666',
                  '&:hover': {
                    borderColor: '#06c167',
                    color: '#06c167',
                  },
                }}
              >
                <ChevronRight />
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Restaurants Grid/Scroll */}
        <Box
          ref={scrollRef}
          sx={{
            display: { xs: 'block', md: 'flex' },
            overflowX: { xs: 'visible', md: 'auto' },
            gap: 2,
            px: 2,
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          {/* Mobile Grid Layout */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Grid container spacing={2}>
              {foods.map((food) => (
                <Grid item xs={12} sm={6} key={food.id}>
                  <FoodCard food={food} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Desktop Horizontal Scroll */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, minWidth: 'max-content' }}>
            {foods.map((food) => (
              <Box key={food.id} 
              sx={{ flexShrink: 0 }}>
                <FoodCard food={food} />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FoodSection;