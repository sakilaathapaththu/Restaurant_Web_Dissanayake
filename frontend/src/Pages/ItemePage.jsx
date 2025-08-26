import React from 'react';
import { Box } from '@mui/material';
// import Header from '../Components/Header';
import SearchBar from '../Components/SearchBar';
import Filters from '../Components/Filters';
import PromoBanner from '../Components/PromoBanner';
import RestaurantSection from '../Components/RestaurantSection';

const Items = () => {
  const popularRestaurants = [
    {
      id: 1,
      name: 'Dissanayake Restaurant',
      rating: 4.3,
      reviewCount: 5000,
      deliveryTime: '19',
      deliveryFee: 0,
      distance: 2.1,
      image: '/api/placeholder/300/180',
      categories: ['Sri Lankan', 'Rice & Curry', 'Seafood'],
      offer: 'Spend LKR 3,500, Save LKR 800',
    },
    {
      id: 2,
      name: 'Asiri Hotel',
      rating: 4.6,
      reviewCount: 7000,
      deliveryTime: '24',
      deliveryFee: 99,
      distance: 1.5,
      image: '/api/placeholder/300/180',
      categories: ['Chinese', 'Thai', 'Continental'],
    },
    {
      id: 3,
      name: 'Mihiri Foods',
      rating: 4.6,
      reviewCount: 8000,
      deliveryTime: '10',
      deliveryFee: 44,
      distance: 0.8,
      image: '/api/placeholder/300/180',
      categories: ['Fast Food', 'Burgers', 'Pizza'],
    },
    {
      id: 4,
      name: 'Wok To Box',
      rating: 4.5,
      reviewCount: 6000,
      deliveryTime: '35',
      deliveryFee: 99,
      distance: 3.2,
      image: '/api/placeholder/300/180',
      categories: ['Chinese', 'Noodles', 'Rice'],
    },
    {
      id: 5,
      name: 'Hotel De Plaza Battaramulla',
      rating: 4.3,
      reviewCount: 5000,
      deliveryTime: '19',
      deliveryFee: 0,
      distance: 2.5,
      image: '/api/placeholder/300/180',
      categories: ['Sri Lankan', 'Continental', 'Seafood'],
    },
  ];

  const speedyDeliveries = [
    {
      id: 6,
      name: 'KFC',
      rating: 4.2,
      reviewCount: 15000,
      deliveryTime: '15',
      deliveryFee: 0,
      distance: 1.2,
      image: '/api/placeholder/300/180',
      categories: ['Fast Food', 'Chicken', 'Burgers'],
      offer: 'Spend LKR 3,500, Save LKR 800',
    },
    {
      id: 7,
      name: 'Neluma Awanhala',
      rating: 4.4,
      reviewCount: 3500,
      deliveryTime: '20',
      deliveryFee: 0,
      distance: 1.8,
      image: '/api/placeholder/300/180',
      categories: ['Sri Lankan', 'Traditional', 'Rice & Curry'],
    },
    {
      id: 8,
      name: 'Rasa Bojun',
      rating: 4.1,
      reviewCount: 2800,
      deliveryTime: '18',
      deliveryFee: 0,
      distance: 1.4,
      image: '/api/placeholder/300/180',
      categories: ['Sri Lankan', 'Rice & Curry', 'Kottu'],
    },
    {
      id: 9,
      name: 'BOJUNKA FOOD & BAKERS',
      rating: 4.3,
      reviewCount: 4200,
      deliveryTime: '25',
      deliveryFee: 0,
      distance: 2.0,
      image: '/api/placeholder/300/180',
      categories: ['Bakery', 'Pastries', 'Cakes'],
    },
  ];

  const nearbyRestaurants = [
    {
      id: 10,
      name: 'Pizza Hutgg',
      rating: 4.1,
      reviewCount: 12000,
      deliveryTime: '30',
      deliveryFee: 150,
      distance: 2.8,
      image: '/api/placeholder/300/180',
      categories: ['Pizza', 'Italian', 'Fast Food'],
    },
    {
      id: 11,
      name: 'Burger King',
      rating: 4.0,
      reviewCount: 8500,
      deliveryTime: '25',
      deliveryFee: 120,
      distance: 2.3,
      image: '/api/placeholder/300/180',
      categories: ['Burgers', 'Fast Food', 'American'],
    },
    {
      id: 12,
      name: 'Subway',
      rating: 4.2,
      reviewCount: 6800,
      deliveryTime: '20',
      deliveryFee: 100,
      distance: 1.9,
      image: '/api/placeholder/300/180',
      categories: ['Sandwiches', 'Healthy', 'Salads'],
    },
    {
      id: 13,
      name: 'Dominos Pizza',
      rating: 4.3,
      reviewCount: 9500,
      deliveryTime: '35',
      deliveryFee: 180,
      distance: 3.1,
      image: '/api/placeholder/300/180',
      categories: ['Pizza', 'Italian', 'Fast Food'],
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f6f6f6' }}>
      {/* <Header /> */}
      <SearchBar />
      <Filters />
      <PromoBanner />

      <RestaurantSection
        title="Popular near you"
        restaurants={popularRestaurants}
      />

      <RestaurantSection
        title="Speedy deliveries"
        restaurants={speedyDeliveries}
      />

      <RestaurantSection
        title="More restaurants"
        restaurants={nearbyRestaurants}
        showSeeAll={false}
      />
    </Box>
  );
};

export default Items;
