// Components/Dashboard/ResponsiveLayout.jsx
import * as React from "react";
import {
  AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List,
  ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Avatar
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Article as ArticleIcon,
  InsertDriveFile as FileIcon,
  Mail as MailIcon,
  BarChart as ChartIcon,
  Campaign as CampaignIcon,
  Work as WorkIcon
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 260;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
  { label: "Promotions", icon: <CampaignIcon />, to: "/promotions" },
  { label: "Careers", icon: <WorkIcon />, to: "/careers" },
  { label: "Posts", icon: <ArticleIcon />, to: "/posts" },
  { label: "Inquiries", icon: <MailIcon />, to: "/inquiries" },
  { label: "Downloads", icon: <FileIcon />, to: "/downloads" },
  { label: "Interest Rates", icon: <ChartIcon />, to: "/rates" },
];

export default function ResponsiveLayout({
  children,
  title = "The Web Site Content Management System (CMS)"
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  // ---- get current admin from localStorage (was saved at login) ----
  const raw = typeof window !== "undefined" ? localStorage.getItem("admin") : null;
  const currentAdmin = React.useMemo(() => {
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  }, [raw]);

  const displayName =
    currentAdmin?.firstName
      ? `${currentAdmin.firstName} ${currentAdmin.lastName ?? ""}`.trim()
      : (currentAdmin?.username || currentAdmin?.email || "Guest");

  const role = currentAdmin?.role; // "superadmin" | "editor" (from backend)

  const handleNavClick = () => setMobileOpen(false);

  const isActive = (to) => {
    // highlight for exact and nested routes (e.g., /posts/new)
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const DrawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar />
      <Box sx={{ px: 2, pb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          {displayName?.slice(0, 2)?.toUpperCase() || "US"}
        </Avatar>
        <Box>
          <Typography fontWeight={700}>Dissanayaka Restaurant</Typography>
          <Typography variant="caption" color="text.secondary">
            User: {displayName}{role ? ` (${role})` : ""}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List sx={{ p: 1, flex: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            onClick={handleNavClick}
            selected={isActive(item.to)}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              "&.Mui-selected": {
                bgcolor: "action.selected",
                "& .MuiListItemIcon-root": { color: "primary.main" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Dissanayaka admin | Powered by Blackcodedevs
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={(t) => ({
          zIndex: t.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: `1px solid ${t.palette.divider}`,
        })}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { md: "none" } }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 800, flex: 1 }}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            Dissanayaka Restaurant | <b>User:</b> {displayName}{role ? ` (${role})` : ""}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {DrawerContent}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: (t) => `1px solid ${t.palette.divider}`,
              top: { xs: 56, sm: 64 },
              height: { xs: "calc(100% - 56px)", sm: "calc(100% - 64px)" },
            },
          }}
        >
          {DrawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
