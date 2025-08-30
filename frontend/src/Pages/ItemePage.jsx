import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import Homepagenavbar from '../Components/Navbar/Homepagenavbar';
import SearchBar from '../Components/itemsCo/SearchBar';
import Filters from '../Components/itemsCo/Filters';
import PromoBanner from '../Components/itemsCo/PromoBanner';
import FoodSection from '../Components/itemsCo/FoodSection';
import API from '../Utils/api';

// Import hardcoded food lists (keeping existing ones)
import { popularFoods, speedyDeliveries, nearbyRestaurants } from '../Components/itemsCo/foodList';

// Import fallback image (use the same as in DishesShowcaseSection)
import fallbackImage from '../Asset/images/foods/chicken-fried-rice.jpg';

const ItemsPage = () => {
  const [backendFoods, setBackendFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add state for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    offers: false,
    deliveryFee: false,
    under30min: false,
    rating: false,
    price: false,
    dietary: false,
    sort: 'recommended',
  });
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(4);
  const [dietaryFilter, setDietaryFilter] = useState('');

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const res = await API.get("/menu-items");

        if (res.data.success) {
          // Transform backend data to match FoodCard expected format
          const transformedFoods = res.data.data.map((item, index) => {
            // Safely extract price as a number
            let priceValue = 0;
            if (item.portions && item.portions.length > 0) {
              priceValue = item.portions[0].finalPrice || item.portions[0].price || 0;
            }

            // Ensure priceValue is a valid number
            priceValue = Number(priceValue);
            if (isNaN(priceValue)) {
              priceValue = 0;
            }

            // Helper function to get image from database or fallback
            const getImageSource = (item) => {
              // Check if item has imageDataUri from backend
              if (item.imageDataUri) {
                return item.imageDataUri;
              }
              // Fallback to default image
              return fallbackImage;
            };

            const transformedItem = {
              id: item._id || `item-${index}`,
              name: item.name || 'Unnamed Dish',
              image: getImageSource(item), // Use database image or fallback
              // IMPORTANT: FoodCard expects price as NUMBER (not string) for toLocaleString()
              price: priceValue, // This should be a number
              // Include portions data for the modal
              portions: item.portions || [], // Backend portions data
              // Other price formats for backup
              priceValue: priceValue,
              originalPrice: priceValue,
              // Fields that FoodCard specifically uses
              rating: 4.5, // Number for Rating component
              reviewCount: 150, // Number for toLocaleString()
              deliveryFee: 0, // Number (0 means free delivery in FoodCard)
              // CRITICAL: Ensure categories is always an array
              categories: Array.isArray(item.categories)
                ? item.categories
                : (item.categoryName ? [item.categoryName] : ['Mixed Cuisine']),
              distance: 2.5, // Number for distance display
              // Optional fields that FoodCard checks for
              offer: null, // String or null for offer badge
              // Backend data for modal
              description: item.description || '',
              category: item.categoryName || 'Uncategorized',
              menuId: item.menuId || '',
              // Additional hardcoded fields
              restaurant: 'Our Restaurant',
              deliveryTime: '25-30 min',
              isPopular: !!item.isPopular,
              isAvailable: true,
            };

            return transformedItem;
          });

          setBackendFoods(transformedFoods);
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
        // Keep backendFoods as empty array on error
        setBackendFoods([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Filter and search logic
  const getFilteredFoods = () => {
    let filtered = [...backendFoods];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Offers filter
    if (filters.offers) {
      filtered = filtered.filter(food => food.offer !== null);
    }

    // Delivery fee filter
    if (filters.deliveryFee) {
      filtered = filtered.filter(food => food.deliveryFee === 0);
    }

    // Under 30 min filter
    if (filters.under30min) {
      filtered = filtered.filter(food => {
        const time = food.deliveryTime;
        const minutes = parseInt(time.match(/\d+/)?.[0] || '30');
        return minutes <= 30;
      });
    }

    // Rating filter
    if (filters.rating) {
      filtered = filtered.filter(food => food.rating >= minRating);
    }

    // Price filter
    if (filters.price) {
      filtered = filtered.filter(food =>
        food.price >= priceRange[0] && food.price <= priceRange[1]
      );
    }

    // Dietary filter
    if (dietaryFilter) {
      filtered = filtered.filter(food =>
        food.categories.some(cat =>
          cat.toLowerCase().includes(dietaryFilter.toLowerCase())
        )
      );
    }

    // Sorting
    switch (filters.sort) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery_time':
        filtered.sort((a, b) => {
          const timeA = parseInt(a.deliveryTime.match(/\d+/)?.[0] || '30');
          const timeB = parseInt(b.deliveryTime.match(/\d+/)?.[0] || '30');
          return timeA - timeB;
        });
        break;
      case 'distance':
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'price_low_high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        // recommended - keep original order
        break;
    }

    return filtered;
  };

  // Get filtered foods
  const filteredFoods = getFilteredFoods();

  // Handle search change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle price range change
  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  // Handle rating change
  const handleRatingChange = (rating) => {
    setMinRating(rating);
  };

  // Handle dietary filter change
  const handleDietaryChange = (dietary) => {
    setDietaryFilter(dietary);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      offers: false,
      deliveryFee: false,
      under30min: false,
      rating: false,
      price: false,
      dietary: false,
      sort: 'recommended',
    });
    setPriceRange([0, 100]);
    setMinRating(4);
    setDietaryFilter('');
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm ||
    Object.values(filters).some(value => value !== false && value !== 'recommended') ||
    dietaryFilter ||
    priceRange[0] !== 0 || priceRange[1] !== 100 ||
    minRating !== 4;

  return (
    <>
      <Homepagenavbar />
      <Box sx={{ py: 3, backgroundColor: 'white' }}>
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          priceRange={priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          minRating={minRating}
          onRatingChange={handleRatingChange}
          onDietaryChange={handleDietaryChange}
          dietaryFilter={dietaryFilter}
        />

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearAllFilters}
              sx={{
                borderRadius: '20px',
                borderColor: '#ddd',
                color: '#666',
                '&:hover': {
                  borderColor: '#06c167',
                  color: '#06c167',
                },
              }}
            >
              Clear all filters
            </Button>
          </Box>
        )}

        <PromoBanner />

        {/* Popular Foods from Backend */}
        {!loading && filteredFoods.filter(food => food.isPopular).length > 0 && (
          <FoodSection title="Popular Foods" foods={filteredFoods.filter(food => food.isPopular)} />
        )}

        {/* Backend data section - only show if we have data and not loading */}
        {!loading && filteredFoods.length > 0 && (
          <FoodSection title="Our Menu" foods={filteredFoods} />
        )}

        {/* Show loading state if needed */}
        {loading && (
          <FoodSection title="Our Menu" foods={[]} />
        )}

        {/* Show no results message */}
        {!loading && filteredFoods.length === 0 && backendFoods.length > 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No items found matching your search and filters.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search terms or filters.
            </Typography>
          </Box>
        )}

        {/* Other existing sections */}
        {/* <FoodSection title="More foods" foods={nearbyRestaurants} showSeeAll={false} /> */}
      </Box>
    </>
  );
};

export default ItemsPage;