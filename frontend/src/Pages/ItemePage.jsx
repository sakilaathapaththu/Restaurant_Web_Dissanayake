import React from 'react';
import { Box } from '@mui/material';
// import Header from '../Components/Header';
import SearchBar from '../Components/itemsCo/SearchBar';
import Filters from '../Components/itemsCo/Filters';
import PromoBanner from '../Components/itemsCo/PromoBanner';
import FoodSection from '../Components/itemsCo/FoodSection';

// Import food lists
import { popularFoods, speedyDeliveries, nearbyRestaurants } from '../Components/itemsCo/foodList';

const ItemsPage = () => {
  return (
    <Box sx={{ py: 3, backgroundColor: 'white' }}>
      {/* <Header /> */}
      <SearchBar />
      <Filters />
      <PromoBanner />

      <FoodSection title="Popular Foods" foods={popularFoods} />
      <FoodSection title="Speedy deliveries" foods={speedyDeliveries} />
      <FoodSection title="More foods" foods={nearbyRestaurants} showSeeAll={false} />
    </Box>
  );
};

export default ItemsPage;
