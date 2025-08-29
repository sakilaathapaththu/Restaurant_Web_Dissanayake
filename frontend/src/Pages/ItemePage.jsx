import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
// import Header from '../Components/Header';
import SearchBar from '../Components/itemsCo/SearchBar';
import Filters from '../Components/itemsCo/Filters';
import PromoBanner from '../Components/itemsCo/PromoBanner';
import FoodSection from '../Components/itemsCo/FoodSection';
import API from '../Utils/api'; // Make sure this path is correct

// Import hardcoded food lists (keeping existing ones)
import { popularFoods, speedyDeliveries, nearbyRestaurants } from '../Components/itemsCo/foodList';

// Import fallback image (use the same as in DishesShowcaseSection)
import fallbackImage from '../Asset/images/foods/chicken-fried-rice.jpg';

const ItemsPage = () => {
  const [backendFoods, setBackendFoods] = useState([]);
  const [loading, setLoading] = useState(true);

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
              // Check if item has image data
              if (item.image && item.image.data && item.image.mime) {
                // Convert base64 to data URL
                return `data:${item.image.mime};base64,${item.image.data}`;
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
              isPopular: false,
              isAvailable: true,
            };

            // Log each transformed item for debugging
            // console.log(`Transformed item ${index}:`, transformedItem);

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

  return (
    <Box sx={{ py: 3, backgroundColor: 'white' }}>
      {/* <Header /> */}
      <SearchBar />
      <Filters />
      <PromoBanner />

      {/* Existing hardcoded sections */}
      <FoodSection title="Popular Foods" foods={popularFoods} />

      {/* Backend data section - only show if we have data and not loading */}
      {!loading && backendFoods.length > 0 && (
        <FoodSection title="Our Menu" foods={backendFoods} />
      )}

      {/* Show loading state if needed */}
      {loading && (
        <FoodSection title="Our Menu" foods={[]} />
      )}

      {/* Other existing sections */}
      <FoodSection title="More foods" foods={nearbyRestaurants} showSeeAll={false} />
    </Box>
  );
};

export default ItemsPage;