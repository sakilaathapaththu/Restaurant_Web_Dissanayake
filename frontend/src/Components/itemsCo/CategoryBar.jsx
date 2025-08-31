import React, { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

const CategoryBar = ({ selectedCategory, onCategorySelect, themeColors }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

const categories = [
  { id: "Popular Foods", name: "Popular Foods", icon: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
  { id: "Salad", name: "Salad", icon: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
  { id: "Soups", name: "Soups", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917890.png" },
  { id: "Fried Rice\n(KeeriSamba)", name: "Fried Rice\n(KeeriSamba)", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917891.png" },
  { id: "Fried Rice\n(Basmathi)", name: "Fried Rice\n(Basmathi)", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917891.png" },
  { id: "Seafood", name: "Seafood", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917892.png" },
  { id: "Special", name: "Special", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917893.png" },
  { id: "Fried Kottu", name: "Fried Kottu", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917894.png" },
  { id: "Fried Noodles", name: "Fried Noodles", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917895.png" },
  { id: "Chicken", name: "Chicken", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917896.png" },
  { id: "Beef", name: "Beef", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917897.png" },
  { id: "Fish Cuttlefish Prawns", name: "Cuttlefish,\nPrawns", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917898.png" },
  { id: "Pasta", name: "Pasta", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917899.png" },
  { id: "Dum Biryani", name: "Dum Biryani", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917900.png" },
  { id: "Indian", name: "Indian", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917901.png" },
  { id: "Submarine", name: "Submarine", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917902.png" },
  { id: "Burger", name: "Burger", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917903.png" },
  { id: "Sandwich", name: "Sandwich", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917904.png" },
  { id: "Shawarma", name: "Shawarma", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917905.png" },
  { id: "Fruit Juice", name: "Fruit Juice", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917906.png" },
  { id: "Milkshake", name: "Milkshake", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917907.png" },
  { id: "Beverages", name: "Beverages", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917908.png" },
  { id: "Desserts", name: "Desserts", icon: "https://cdn-icons-png.flaticon.com/512/2917/2917909.png" },
];



  // Drag handlers
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
    const walk = (x - startX) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <Box
      ref={scrollRef}
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: 2,
        px: 2,
        py: 2,
        whiteSpace: "nowrap",
        "&::-webkit-scrollbar": { display: "none" },
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        backgroundColor: "#fff",
      }}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {categories.map((cat) => (
        <Box
          key={cat.id}
          onClick={() => onCategorySelect(cat.id)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 80,
            cursor: "pointer",
            flexShrink: 0,
            transition: "transform 0.2s ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                selectedCategory === cat.id ? themeColors.accent : themeColors.secondary,
              border:
                selectedCategory === cat.id
                  ? `2px solid ${themeColors.accent}`
                  : "2px solid transparent",
              transition: "all 0.3s ease",
            }}
          >
            <img
              src={cat.icon}
              alt={cat.name}
              style={{ width: 36, height: 36, objectFit: "contain" }}
            />
          </Box>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              fontSize: "13px",
              fontWeight: selectedCategory === cat.id ? 600 : 500,
              color: selectedCategory === cat.id ? themeColors.accent : themeColors.primary,
              textAlign: "center",
              lineHeight: 1.2,
              maxWidth: 80,
              whiteSpace: "pre-line", // For multi-line text
            }}
          >
            {cat.name}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CategoryBar;
