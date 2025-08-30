import React from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import FoodCard from './FoodCard';

const FoodSection = ({ title, foods, showSeeAll = true }) => {
  const scrollRef = React.useRef(null);
  const [showAll, setShowAll] = React.useState(false);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <Box sx={{ py: 3, backgroundColor: 'Seashell White' }}>
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
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#000' }}>
            {title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showSeeAll && (
              <Button
                variant="text"
                onClick={() => setShowAll(!showAll)}
                sx={{
                  color: '#06c167',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                }}
              >
                {showAll ? 'Show less' : 'See all'}
              </Button>
            )}

            {/* Navigation Arrows (always visible) */}
            {!showAll && (
              <Box sx={{ display: 'flex', gap: 1 }}>
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
                    '&:hover': { borderColor: '#06c167', color: '#06c167' },
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
                    '&:hover': { borderColor: '#06c167', color: '#06c167' },
                  }}
                >
                  <ChevronRight />
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* Food Cards */}
        {!showAll ? (
          // Scrollable Section
          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: 2,
              px: 2,
              scrollBehavior: 'smooth',
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {foods.map((food) => (
              <Box
                key={food.id}
                sx={{
                  flexShrink: 0,
                  minWidth: { xs: '30%', sm: '200px', md: '280px' }, // 3 cards min on mobile
                }}
              >
                <FoodCard food={food} />
              </Box>
            ))}
          </Box>
        ) : (
          // Expanded Grid View (See all mode)
          <Box sx={{ px: 2 }}>
            <Grid container spacing={2}>
              {foods.map((food) => (
                <Grid item xs={12} sm={6} md={3} key={food.id}>
                  <FoodCard food={food} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FoodSection;
