import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import Homepagenavbar from '../Components/Navbar/Homepagenavbar';
import SearchBar from '../Components/itemsCo/SearchBar';
import PromoBanner from '../Components/itemsCo/PromoBanner';
import FoodSection from '../Components/itemsCo/FoodSection';
import CategoryBar from '../Components/itemsCo/CategoryBar';
import API from '../Utils/api';
import fallbackImage from '../Asset/images/foods/chicken-fried-rice.jpg';

const categoryOrder = [
  'Popular Foods', 'Salad', 'Soups', 'Starters', 'Appetizer', 'Fried Rice (Keeri Samba)',
  'Fried Rice (Basmathi)', 'Meat, Poultry & Seafood', 'Special', 'Fried Kottu', 'Fried Noodles',
  'Chicken', 'Beef', 'Fish , Cuttlefish, Prawns', 'Pasta', 'Dum Biryani', 'Indian', 'Submarine',
  'Burger', 'Sandwich', 'Shawarma', 'Fruit Juice', 'Milkshake', 'Beverages', 'Desserts'
];

const ItemsPage = () => {
  const [backendFoods, setBackendFoods] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch backend menu
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const res = await API.get("/menu-items");
        if (res.data.success) {
          const transformedFoods = res.data.data.map((item, index) => {
            const priceValue = Number(item.portions?.[0]?.finalPrice || item.portions?.[0]?.price || 0);
            const categories = Array.isArray(item.categories)
              ? item.categories
              : item.categoryName
                ? [item.categoryName]
                : ['Mixed Cuisine'];

            return {
              id: item._id || `item-${index}`,
              name: item.name || 'Unnamed Dish',
              image: item.imageDataUri || fallbackImage,
              price: isNaN(priceValue) ? 0 : priceValue,
              portions: item.portions || [],
              priceValue: priceValue,
              originalPrice: priceValue,
              rating: 4.5,
              reviewCount: 150,
              deliveryFee: 0,
              categories,
              distance: 2.5,
              offer: null,
              description: item.description || '',
              category: item.categoryName || 'Uncategorized',
              menuId: item.menuId || '',
              restaurant: 'Our Restaurant',
              deliveryTime: '25-30 min',
              isPopular: !!item.isPopular,
              isAvailable: true,
            };
          });

          setBackendFoods(transformedFoods);
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setBackendFoods([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  // Filtering & sorting
  const getFilteredFoods = () => {
    let filtered = [...backendFoods];

    if (searchTerm.trim()) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.offers) filtered = filtered.filter(food => food.offer !== null);
    if (filters.deliveryFee) filtered = filtered.filter(food => food.deliveryFee === 0);
    if (filters.under30min) {
      filtered = filtered.filter(food => parseInt(food.deliveryTime.match(/\d+/)?.[0] || '30') <= 30);
    }
    if (filters.rating) filtered = filtered.filter(food => food.rating >= minRating);
    if (filters.price) filtered = filtered.filter(food => food.price >= priceRange[0] && food.price <= priceRange[1]);
    if (dietaryFilter) {
      filtered = filtered.filter(food =>
        food.categories.some(cat => cat.toLowerCase().includes(dietaryFilter.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(food =>
        selectedCategory === "Popular Foods"
          ? food.isPopular
          : food.categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // Sorting
    switch (filters.sort) {
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'delivery_time': filtered.sort((a, b) =>
        parseInt(a.deliveryTime.match(/\d+/)?.[0] || '30') -
        parseInt(b.deliveryTime.match(/\d+/)?.[0] || '30')
      ); break;
      case 'distance': filtered.sort((a, b) => a.distance - b.distance); break;
      case 'price_low_high': filtered.sort((a, b) => a.price - b.price); break;
      case 'price_high_low': filtered.sort((a, b) => b.price - a.price); break;
      default: break;
    }

    return filtered;
  };

  const filteredFoods = getFilteredFoods();

  // Handlers
  const handleSearchChange = term => setSearchTerm(term);
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({ offers: false, deliveryFee: false, under30min: false, rating: false, price: false, dietary: false, sort: 'recommended' });
    setPriceRange([0, 100]);
    setMinRating(4);
    setDietaryFilter('');
    setSelectedCategory('All');
  };

  const hasActiveFilters = searchTerm ||
    Object.values(filters).some(value => value !== false && value !== 'recommended') ||
    dietaryFilter ||
    priceRange[0] !== 0 || priceRange[1] !== 100 ||
    minRating !== 4 ||
    selectedCategory !== 'All';

  return (
    <>
      <Homepagenavbar />
      <Box sx={{ py: 3, backgroundColor: '#fff5eb' , px: { xs: 0, sm: 4, md: 12, lg: 22 } }}>
        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

        {hasActiveFilters && (
          <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearAllFilters}
              sx={{
                borderRadius: '20px',
                borderColor: '#2c1000',
                color: '#2c1000',
                '&:hover': { borderColor: '#fda021', color: '#fda021' },
              }}
            >
              Clear all filters
            </Button>
          </Box>
        )}

       <PromoBanner onCategorySelect={setSelectedCategory} />

        {/*  CategoryBar inserted here */}
        <CategoryBar
          categories={["All", ...categoryOrder]}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          themeColors={{ primary: "#2c1000", secondary: "#ffffffff", accent: "#fda021" }}
        />

        {/* Render Foods */}
        {selectedCategory === "All"
          ? categoryOrder.map((categoryName) => {
              const foodsInCategory = filteredFoods.filter(food =>
                categoryName === "Popular Foods"
                  ? food.isPopular
                  : food.categories.some(cat => cat.toLowerCase() === categoryName.toLowerCase())
              );
              return foodsInCategory.length > 0 ? (
                <FoodSection
                  key={categoryName}
                  title={categoryName}
                  foods={foodsInCategory}
                  themeColors={{ primary: "#2c1000", secondary: "#e8d5c4", accent: "#fda021" }}
                />
              ) : null;
            })
          : (
            <FoodSection
              title={selectedCategory}
              foods={filteredFoods}
              themeColors={{ primary: "#2c1000", secondary: "#e8d5c4", accent: "#fda021" }}
            />
          )
        }

        {loading && <FoodSection title="Loading..." foods={[]} />}

        {!loading && filteredFoods.length === 0 && backendFoods.length > 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="#2c1000">No items found.</Typography>
            <Typography variant="body2" color="#2c1000" sx={{ mt: 1 }}>
              Try adjusting your search terms or filters.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default ItemsPage;
