// Components/itemsCo/CategoryBar.js
import React from "react";
import { Box, Chip } from "@mui/material";

const CategoryBar = ({ categories, selectedCategory, onCategorySelect, themeColors }) => {
  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        whiteSpace: "nowrap",
        gap: 1,
        px: 2,
        py: 1,
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": { display: "none" }, // Chrome
      }}
    >
      {categories.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          onClick={() => onCategorySelect(cat)}
          sx={{
            borderRadius: "20px",
            fontWeight: 500,
            cursor: "pointer",
            backgroundColor:
              selectedCategory === cat ? themeColors.accent : themeColors.secondary,
            color:
              selectedCategory === cat ? "#fff" : themeColors.primary,
            "&:hover": {
              backgroundColor: themeColors.accent,
              color: "#fff",
            },
          }}
        />
      ))}
    </Box>
  );
};

export default CategoryBar;
