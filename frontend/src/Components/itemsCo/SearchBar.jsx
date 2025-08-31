import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
  Chip,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const SearchBar = ({ searchTerm = '', onSearchChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  const popularSearches = [
    'Chicken', 'Beef', 'Fish , Cuttlefish, Prawns', 'Pasta', 'Dum Biryani', 'Indian',
    'Coffee', 'Healthy', 'Fast Food', 'Desserts', 'Salad', 'Fried Rice'
  ];

  const handleClear = () => onSearchChange?.('');
  const handleSearchChange = (e) => onSearchChange?.(e.target.value);
  const handlePopularSearchClick = (search) => onSearchChange?.(search);

  const filteredPopularSearches = popularSearches.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ px: 2, py: 2, backgroundColor: 'Seashell White', position: 'relative' }}>
      <TextField
        fullWidth
        placeholder="Search foods and categories"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#999' }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} edge="end" size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: '8px',
            backgroundColor: '#ffffffff',
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&:hover .MuiOutlinedInput-notchedOutline': { border: '1px solid #ddd' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '2px solid #fda021' },
          },
        }}
      />

      {(isFocused || searchTerm) && filteredPopularSearches.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            mt: 1,
            p: 2,
            borderRadius: '8px',
            position: 'absolute',
            left: 16,
            right: 16,
            zIndex: 1000,
            backgroundColor: 'white',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
            Popular searches
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filteredPopularSearches.map((search) => (
              <Chip
                key={search}
                label={search}
                variant="outlined"
                size="small"
                clickable
                onClick={() => handlePopularSearchClick(search)}
                sx={{ borderRadius: '16px', '&:hover': { backgroundColor: '#f0f0f0' } }}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
