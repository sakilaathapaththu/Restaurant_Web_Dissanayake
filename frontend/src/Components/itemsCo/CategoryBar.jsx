import React, { useRef, useState } from "react";
import { Box, Chip } from "@mui/material";

const CategoryBar = ({ categories, selectedCategory, onCategorySelect, themeColors }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2; // scroll speed factor
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <Box
      ref={scrollRef}
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: 1,
        px: 2,
        py: 1,
        whiteSpace: "nowrap",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
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
            backgroundColor: selectedCategory === cat ? themeColors.accent : themeColors.secondary,
            color: selectedCategory === cat ? "#fff" : themeColors.primary,
            "&:hover": { backgroundColor: themeColors.accent, color: "#fff" },
            flexShrink: 0, // ✅ keeps chip from shrinking
          }}
        />
      ))}
    </Box>
  );
};

export default CategoryBar;
