import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography, Chip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const EmailListSidebar = ({ emailList, onEmailSelect, deletedEmailId }) => {
  const [filteredEmails, setFilteredEmails] = useState(emailList);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEmailId, setSelectedEmailId] = useState(null);

  useEffect(() => {
    // Update filtered emails when emailList prop changes
    setFilteredEmails(emailList);
  }, [emailList]);

  useEffect(() => {
    // Handle deleted email
    if (deletedEmailId) {
      const updatedEmails = filteredEmails.filter((email) => email.id !== deletedEmailId);
      setFilteredEmails(updatedEmails);
      if (selectedEmailId === deletedEmailId) {
        setSelectedEmailId(null); // Clear selected email if deleted
      }
    }
  }, [deletedEmailId, filteredEmails, selectedEmailId]);

  const handleFilterChange = (type) => {
    if (type === "all") {
      setFilteredEmails(emailList);
    } else {
      const filtered = emailList.filter((email) => email.type === type);
      setFilteredEmails(filtered);
    }
    setActiveFilter(type);
    setSelectedEmailId(null); // Reset selected email when filter changes
  };

  const handleEmailSelect = (email) => {
    onEmailSelect(email);
    setSelectedEmailId(email.id); // Set the selected email ID
  };

  return (
    <div
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 1,
        boxShadow: 2,
        padding: 2,
        border: "0.2px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{}}>
        Demands List
      </Typography>
      <div style={{ marginBottom: 10 }}>
        <Chip
          label="All"
          onClick={() => handleFilterChange("all")}
          color={activeFilter === "all" ? "primary" : "default"}
          variant="outlined"
          sx={{
            marginRight: 1,
            borderRadius: "borderRadius",
            borderTopLeftRadius: "borderRadius",
            borderTopRightRadius: "borderRadius",
            backgroundColor: activeFilter === "all" ? "primary.main" : "action.hover",
            color: activeFilter === "all" ? "primary.contrastText" : "text.primary",
            "&:hover": {
              backgroundColor: activeFilter === "all" ? "primary.dark" : "action.hover",
            },
            border: "1px solid",
            borderColor: "divider",
          }}
        />
        <Chip
          label="Change Password"
          onClick={() => handleFilterChange("changePassword")}
          color={activeFilter === "changePassword" ? "primary" : "default"}
          variant="outlined"
          sx={{
            marginRight: 1,
            borderRadius: "borderRadius",
            backgroundColor: activeFilter === "changePassword" ? "warning.main" : "action.selected",
            color: activeFilter === "changePassword" ? "warning.contrastText" : "text.primary",
            "&:hover": {
              backgroundColor: activeFilter === "changePassword" ? "warning.dark" : "action.hover",
            },
            border: "1px solid",
            borderColor: "divider",
          }}
        />
        <Chip
          label="Change Location"
          onClick={() => handleFilterChange("changeLocation")}
          color={activeFilter === "changeLocation" ? "primary" : "default"}
          variant="outlined"
          sx={{
            borderRadius: "borderRadius",
            backgroundColor: activeFilter === "changeLocation" ? "info.main" : "action.selected",
            color: activeFilter === "changeLocation" ? "info.contrastText" : "text.primary",
            "&:hover": {
              backgroundColor: activeFilter === "changeLocation" ? "info.dark" : "action.hover",
            },
            border: "1px solid",
            borderColor: "divider",
          }}
        />
      </div>
      <List
        sx={{
          maxHeight: "calc(100vh - 220px)",
          overflowY: "auto",
          border: "0.5px solid",
          borderColor: "divider",
          borderRadius: "borderRadius",
          marginTop: 2,
        }}
      >
        {filteredEmails.map((email) => (
          <ListItem
            key={email.id}
            button
            selected={selectedEmailId === email.id}
            onClick={() => handleEmailSelect(email)}
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:hover": {
                backgroundColor: "action.hover",
              },
              borderRadius: "borderRadius",
              marginBottom: 1,
              border: "0.2px solid",
              borderColor: "divider",
              backgroundColor: selectedEmailId === email.id ? "action.selected" : "background.paper",
            }}
          >
            <ListItemText
              primary={email.subject}
              secondary={`${email.fullName} - ${new Date(email.date).toLocaleDateString()}`}
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: "bold",
                },
                "& .MuiListItemText-secondary": {
                  fontSize: "0.9rem",
                  color: "text.secondary",
                },
              }}
            />
            {email.type === "changePassword" && <LockIcon sx={{ color: "warning.main", border: "1px solid divider" }} />}
            {email.type === "changeLocation" && <LocationOnIcon sx={{ color: "info.main", border: "1px solid divider" }} />}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default EmailListSidebar;
