// src/Components/Filters.js
import React, { useState } from 'react';
import {
  Box,
  Chip,
  Menu,
  MenuItem,
  Typography,
  Slider,
  FormControlLabel,
  Switch,
  Button,
  Divider,
  Rating,
} from '@mui/material';
import {
  FilterList,
  AccessTime,
  Star,
  AttachMoney,
  LocalOffer,
  KeyboardArrowDown,
} from '@mui/icons-material';

const Filters = () => {
  const [anchorEl, setAnchorEl] = useState({});
  const [filters, setFilters] = useState({
    offers: false,
    deliveryFee: false,
    under30min: false,
    rating: false,
    price: false,
    dietary: false,
    sort: 'recommended',
  });
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [minRating, setMinRating] = useState(4);

  const handleClick = (event, filterType) => {
    setAnchorEl({ ...anchorEl, [filterType]: event.currentTarget });
  };

  const handleClose = (filterType) => {
    setAnchorEl({ ...anchorEl, [filterType]: null });
  };

  const filterChips = [
    {
      key: 'offers',
      label: 'Offers',
      icon: <LocalOffer sx={{ fontSize: 16 }} />,
      active: filters.offers,
    },
    {
      key: 'deliveryFee',
      label: 'Delivery fee',
      icon: null,
      active: filters.deliveryFee,
    },
    {
      key: 'under30min',
      label: 'Under 30 min',
      icon: <AccessTime sx={{ fontSize: 16 }} />,
      active: filters.under30min,
    },
    {
      key: 'rating',
      label: 'Rating',
      icon: <Star sx={{ fontSize: 16 }} />,
      active: filters.rating,
    },
    {
      key: 'price',
      label: 'Price',
      icon: <AttachMoney sx={{ fontSize: 16 }} />,
      active: filters.price,
    },
    {
      key: 'dietary',
      label: 'Dietary',
      icon: null,
      active: filters.dietary,
    },
    {
      key: 'sort',
      label: 'Sort',
      icon: <FilterList sx={{ fontSize: 16 }} />,
      active: false,
    },
  ];

  const toggleFilter = (filterKey) => {
    setFilters({ ...filters, [filterKey]: !filters[filterKey] });
  };

  return (
    <Box sx={{ px: 2, py: 1, backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
        {filterChips.map((chip) => (
          <Chip
            key={chip.key}
            label={chip.label}
            icon={chip.icon}
            variant={chip.active ? "filled" : "outlined"}
            clickable
            onClick={(e) => handleClick(e, chip.key)}
            endIcon={<KeyboardArrowDown sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: '20px',
              minWidth: 'fit-content',
              backgroundColor: chip.active ? '#06c167' : 'transparent',
              color: chip.active ? 'white' : '#000',
              borderColor: chip.active ? '#06c167' : '#ddd',
              '&:hover': {
                backgroundColor: chip.active ? '#05a756' : '#f0f0f0',
              },
            }}
          />
        ))}
      </Box>

      {/* Offers Menu */}
      <Menu
        anchorEl={anchorEl.offers}
        open={Boolean(anchorEl.offers)}
        onClose={() => handleClose('offers')}
      >
        <MenuItem onClick={() => { toggleFilter('offers'); handleClose('offers'); }}>
          <FormControlLabel
            control={<Switch checked={filters.offers} />}
            label="Show offers only"
          />
        </MenuItem>
      </Menu>

      {/* Delivery Fee Menu */}
      <Menu
        anchorEl={anchorEl.deliveryFee}
        open={Boolean(anchorEl.deliveryFee)}
        onClose={() => handleClose('deliveryFee')}
        PaperProps={{ sx: { minWidth: 250 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Delivery fee</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={filters.deliveryFee}
                onChange={() => toggleFilter('deliveryFee')}
              />
            }
            label="Free delivery"
          />
        </Box>
      </Menu>

      {/* Under 30 min Menu */}
      <Menu
        anchorEl={anchorEl.under30min}
        open={Boolean(anchorEl.under30min)}
        onClose={() => handleClose('under30min')}
      >
        <MenuItem onClick={() => { toggleFilter('under30min'); handleClose('under30min'); }}>
          <FormControlLabel
            control={<Switch checked={filters.under30min} />}
            label="Under 30 minutes"
          />
        </MenuItem>
      </Menu>

      {/* Rating Menu */}
      <Menu
        anchorEl={anchorEl.rating}
        open={Boolean(anchorEl.rating)}
        onClose={() => handleClose('rating')}
        PaperProps={{ sx: { minWidth: 250 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Minimum rating</Typography>
          <Rating
            value={minRating}
            onChange={(event, newValue) => setMinRating(newValue)}
            precision={0.5}
          />
          <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
            {minRating} stars and above
          </Typography>
        </Box>
      </Menu>

      {/* Price Menu */}
      <Menu
        anchorEl={anchorEl.price}
        open={Boolean(anchorEl.price)}
        onClose={() => handleClose('price')}
        PaperProps={{ sx: { minWidth: 300 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Price range (LKR)</Typography>
          <Slider
            value={priceRange}
            onChange={(event, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            step={5}
            sx={{ color: '#06c167' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">LKR {priceRange[0]}</Typography>
            <Typography variant="body2">LKR {priceRange[1]}+</Typography>
          </Box>
        </Box>
      </Menu>

      {/* Dietary Menu */}
      <Menu
        anchorEl={anchorEl.dietary}
        open={Boolean(anchorEl.dietary)}
        onClose={() => handleClose('dietary')}
      >
        <MenuItem>Vegetarian</MenuItem>
        <MenuItem>Vegan</MenuItem>
        <MenuItem>Gluten-free</MenuItem>
        <MenuItem>Halal</MenuItem>
      </Menu>

      {/* Sort Menu */}
      <Menu
        anchorEl={anchorEl.sort}
        open={Boolean(anchorEl.sort)}
        onClose={() => handleClose('sort')}
      >
        <MenuItem selected={filters.sort === 'recommended'}>
          Recommended
        </MenuItem>
        <MenuItem selected={filters.sort === 'rating'}>
          Rating
        </MenuItem>
        <MenuItem selected={filters.sort === 'delivery_time'}>
          Delivery time
        </MenuItem>
        <MenuItem selected={filters.sort === 'distance'}>
          Distance
        </MenuItem>
        <MenuItem selected={filters.sort === 'price_low_high'}>
          Price: low to high
        </MenuItem>
        <MenuItem selected={filters.sort === 'price_high_low'}>
          Price: high to low
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Filters;