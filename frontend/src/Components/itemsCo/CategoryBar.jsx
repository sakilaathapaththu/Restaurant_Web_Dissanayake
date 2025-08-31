import React, { useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

const CategoryBar = ({ selectedCategory, onCategorySelect, themeColors }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => {
    const key = item.replace("./", "").replace(/\.(png|jpe?g|svg)$/, "");
    images[key] = r(item);
  });
  return images;
};

// Import all images from the categories folder
const categoryImages = importAll(require.context("../../Asset/images/categories", false, /\.(png|jpe?g|svg)$/));

const categories = [
  { id: "Popular Foods", name: "Popular Foods", icon: categoryImages["1205049"] },
  { id: "Salad", name: "Salad", icon: categoryImages["Salad"] },
  { id: "Soups", name: "Soups", icon: categoryImages["Soups"] },
  { id: "Fried Rice\n(KeeriSamba)", name: "Fried Rice\n(KeeriSamba)", icon: categoryImages["FriedRice"] },
  { id: "Fried Rice\n(Basmathi)", name: "Fried Rice\n(Basmathi)", icon: categoryImages["FriedRice2"] },
  { id: "Seafood", name: "Seafood", icon: categoryImages["Seafood"] },
  { id: "Special", name: "Special", icon: categoryImages["Special"] },
  { id: "Fried Kottu", name: "Fried Kottu", icon: categoryImages["FriedKottu"] },
  { id: "Noodles", name: "Noodles", icon: categoryImages["noodles"] },
  { id: "Chicken", name: "Chicken", icon: categoryImages["ChickenN"] },
  { id: "Beef", name: "Beef", icon: categoryImages["Beef"] },
  { id: "Fish Cuttlefish Prawns", name: "Cuttlefish,\nPrawns", icon: categoryImages["prawn"] },
  { id: "Pasta", name: "Pasta", icon: categoryImages["Pasta"] },
  { id: "Dum Biryani", name: "Dum Biryani", icon: categoryImages["biryani"] },
  { id: "Indian", name: "Indian", icon: categoryImages["Indian"] },
  { id: "Submarine", name: "Submarine", icon: categoryImages["Submarine"] },
  { id: "Burger", name: "Burger", icon: categoryImages["burger"] },
  { id: "Sandwich", name: "Sandwich", icon: categoryImages["sandwich"] },
  { id: "Shawarma", name: "Shawarma", icon: categoryImages["Shawarma"] },
  { id: "Fruit Juice", name: "Fruit Juice", icon: categoryImages["FruitJuice"] },
  { id: "Milkshake", name: "Milkshake", icon: categoryImages["Milkshake"] },
  { id: "Beverages", name: "Beverages", icon: categoryImages["Beverages"] },
  { id: "Desserts", name: "Desserts", icon: categoryImages["Desserts"] },
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
        backgroundColor: "#fff5eb",
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
