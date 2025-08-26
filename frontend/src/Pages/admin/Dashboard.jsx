import * as React from "react";
import {
  Box, Card, CardActionArea, CardContent, Grid, Typography
} from "@mui/material";
import {
  Campaign as CampaignIcon,
  Work as WorkIcon,
  Edit as EditIcon,
  ListAlt as ListIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "../../Components/Dashboard/ResponsiveLayout";

const tiles = [
  { label: "Add Items", icon: <CampaignIcon fontSize="large" />, color: "#007C80", to: "/items/new" },
  { label: "Create Admin", icon: <WorkIcon fontSize="large" />, color: "#FF7262", to: "/admins/create", roles: ["superadmin"] },
  { label: "Pending Orders", icon: <EditIcon fontSize="large" />, color: "#B1CB5C", to: "/orders/pending" },
  { label: "View All Orders", icon: <ListIcon fontSize="large" />, color: "#C9A2C8", to: "/orders" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  let role = null;
  try { role = JSON.parse(localStorage.getItem("admin"))?.role; } catch {}

  const visibleTiles = tiles.filter(t => !t.roles || t.roles.includes(role));

  return (
    <ResponsiveLayout>
      <Grid container spacing={2}>
        {visibleTiles.map((t) => (
          <Grid key={t.label} item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: 4, bgcolor: t.color, color: "#fff" }}>
              <CardActionArea onClick={() => t.to && navigate(t.to)}>
                <CardContent sx={{ px: 3, py: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ width: 36, height: 36, display: "grid", placeItems: "center",
                               bgcolor: "rgba(255,255,255,0.18)", borderRadius: 1.2 }}>
                      {t.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700}>{t.label}</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </ResponsiveLayout>
  );
}
