import React, { useState } from "react";
import { LightModeOutlined, DarkModeOutlined, Menu as MenuIcon, Search, SettingsOutlined, ArrowDropDownOutlined } from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { useDispatch } from "react-redux";
import { setMode } from "../state";
import profileImage from "../assets/profile.jpeg";
import { useTheme, AppBar, Toolbar, IconButton, InputBase, Button, Box, useMediaQuery, Typography, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Navbar({ user, setIsSidebarOpen, isSidebarOpen }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate

  // State and functions for menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const isSmallScreen = useMediaQuery("(max-width: 959.95px)");

  // Function to handle logout
  const handleLogout = () => {
    // Clear user session (e.g., remove token from localStorage)
    localStorage.removeItem("token");
    // Redirect to login page after logout
    navigate("/LoginPage"); // Use navigate instead of history.push
  };

  const handleLogin = () => {
    navigate("/Admin Profile");
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          {isSmallScreen && (
            <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <MenuIcon />
            </IconButton>
          )}
          <FlexBetween backgroundColor={theme.palette.background.alt} borderRadius="9px" gap="3rem" p="0.1rem 1.5rem">
            <InputBase placeholder="Search...." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>
        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => dispatch(setMode())}>{theme.palette.mode === "dark" ? <DarkModeOutlined sx={{ fontSize: "25px" }} /> : <LightModeOutlined sx={{ fontSize: "25px" }} />}</IconButton>
          <IconButton>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>
          {/* Profile Button */}
          <Button
            onClick={handleClick} // Handle click to open menu
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textTransform: "none",
              gap: "1rem",
            }}
          >
            <Box textAlign="left">
              <Typography fontWeight="bold" fontSize="0.85rem" sx={{ color: theme.palette.secondary[100] }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography fontSize="0.75rem" sx={{ color: theme.palette.secondary[200] }}>
                {user.role}
              </Typography>
            </Box>
            <ArrowDropDownOutlined sx={{ color: theme.palette.secondary[300], fontSize: "25px" }} />
          </Button>
          {/* Menu */}
          <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
            <MenuItem onClick={handleLogin}>Profile</MenuItem>
            {/* Logout Menu Item */}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
