import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery, // Added import
} from "@mui/material";
import { ChevronRightOutlined, ChevronRight, ChevronLeft, AdminPanelSettingsOutlined, SettingsOutlined, DescriptionOutlined, ListAltOutlined, AssignmentOutlined, BarChartOutlined, LockOutlined, PeopleAltOutlined } from "@mui/icons-material";

import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const Sidebar = ({ user, drawerWidth, isSidebarOpen, setIsSidebarOpen, isNonMobile }) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1600px)"); // Added media query
  const isSmallScreen = useMediaQuery("(max-width: 959.95px)");

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  // Determine which links to show based on user role
  const navItems = [
    {
      text: "Data Analysis and Statistics",
      icon: null,
    },
    {
      text: "View Platform Statistics",
      icon: <BarChartOutlined />,
    },
    {
      text: "Content Management",
      icon: null,
    },
    {
      text: "Browse Publications",
      icon: <DescriptionOutlined />,
    },
    {
      text: "Report and Verification Management",
      icon: null,
    },
    {
      text: "Account Verification Requests Management",
      icon: <AssignmentOutlined />,
    },
    // {
    //   text: "View Participation Publication Results",
    //   icon: <DescriptionOutlined />,
    // },
    {
      text: "General User Interaction",
      icon: null,
    },
    {
      text: "Browse User List (Citizens)",
      icon: <PeopleAltOutlined />,
    },
  ];

  // Show the first two links for superadmin, hide for admin
  if (user.role === "superadmin") {
    navItems.unshift(
      {
        text: "User Account Management",
        icon: null,
      },
      {
        text: "Admin Account Management",
        icon: <AdminPanelSettingsOutlined />,
      }
    );
  }

  const sidebarStyle = {
    backgroundColor: "#072923", // Background color for both light and dark modes
    color: "#FFFFFF", // Text color for both light and dark modes
  };

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              backgroundColor: "#072923",
              color: "#FFFFFF",
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%" sx={sidebarStyle}>
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <svg
                      width="45.2"
                      height="45.2"
                      viewBox="0 0 169 169"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        marginRight: "0.5rem",
                        width: "45.2px",
                        height: "45.2px",
                      }}
                    >
                      <path
                        className="path"
                        fill="#FFFFFF" // Always white
                        fillRule="evenodd"
                        clipRule="evenodd"
                        stroke="#FFFFFF" // Always white
                        strokeWidth="2"
                        d="M14.0625 63.2812L84.375 14.0625L154.688 63.2812H14.0625ZM21.0938 140.625V133.594H147.656V140.625H21.0938ZM21.0938 147.656V154.688H147.656V147.656H21.0938ZM84.375 22.4999L132.187 56.2499H36.5624L84.375 22.4999ZM42.1875 126.562V70.3125H35.1562V126.562H42.1875ZM70.3125 70.3125V126.562H63.2812V70.3125H70.3125ZM105.469 126.562V70.3125H98.4375V126.562H105.469ZM133.594 70.3125V126.562H126.562V70.3125H133.594Z"
                      />
                    </svg>
                    EGOVHUB
                  </Typography>
                </Box>
                {isSmallScreen ? (
                  isSidebarOpen ? (
                    <IconButton onClick={() => setIsSidebarOpen(false)}>
                      <ChevronLeft />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => setIsSidebarOpen(true)}>
                      <ChevronRight />
                    </IconButton>
                  )
                ) : null}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, children }) => {
                if (!icon) {
                  return (
                    <Typography
                      key={text}
                      variant="body2"
                      sx={{
                        mx: "1.5rem",
                        my: "0.5rem",
                        color: theme.palette.secondary[300],
                      }}
                    >
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        if (children) {
                          setActive(active === lcText ? "" : lcText);
                        } else {
                          navigate(`/${lcText}`);
                          setActive(lcText);
                        }
                      }}
                      sx={{
                        backgroundColor: active === lcText ? "#263240" : "transparent",
                        color:
                          active === lcText
                            ? "#FFFFFF" // White text color for active item
                            : "#FFFFFF", // White text color for inactive item
                        "&:hover": {
                          backgroundColor:
                            active === lcText
                              ? "#000000" // Hover background color for active item
                              : "#000000", // Black hover background color for inactive item
                          color: "#FFFFFF", // White text color for both active and inactive items on hover
                        },
                      }}
                    >
                      <ListItemIcon sx={{ ml: "1.5rem", color: "#FFFFFF" }}>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                      {children && (
                        <ChevronRightOutlined
                          sx={{
                            ml: "auto",
                            transform: active === lcText ? "rotate(90deg)" : "none",
                          }}
                        />
                      )}
                    </ListItemButton>
                    {children && active === lcText && (
                      <List disablePadding>
                        {children.map(({ text: childText, icon: childIcon }) => (
                          <ListItem
                            key={childText}
                            disablePadding
                            sx={{
                              pl: "3rem",
                              backgroundColor: active === lcText ? "#FFFFFF" : "transparent",
                            }}
                          >
                            <ListItemButton
                              onClick={() => {
                                navigate(`/${lcText}/${childText.toLowerCase().replace(/\s/g, "-")}`);
                                setActive(lcText);
                              }}
                              sx={{
                                color: "#FFFFFF",
                                "&:hover": {
                                  backgroundColor: "#000000",
                                  color: "#FFFFFF",
                                },
                              }}
                            >
                              <ListItemIcon sx={{ ml: "1.5rem", color: "#FFFFFF" }}>{childIcon}</ListItemIcon>
                              <ListItemText primary={childText} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
