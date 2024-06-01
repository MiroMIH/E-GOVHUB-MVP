import React, { useState, useEffect } from "react";
import { Drawer, List, ListItem, ListItemText, Select, Typography, MenuItem, TextField, Button, Divider, Box } from "@mui/material";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useUpdatePublicationMutation } from "../state/api";

import LocationMenu from "./LocationMenu";

const CardDrawer = ({ open, onClose, cardData, algeriaCities }) => {
  // Destructuring cardData for initial state
  const { title, type, content, startDate, endDate, wilaya, commune, domain, allowAnonymousParticipation } = cardData;
  const [updatePublicationMutation] = useUpdatePublicationMutation();

  // State for edited data
  const [editedData, setEditedData] = useState({
    title: title || "",
    type: type || "",
    content: content || "",
    startDate: startDate ? startDate.split("T")[0] : "",
    endDate: endDate ? endDate.split("T")[0] : "",
    commune: commune || "",
    wilaya: wilaya || "",
    domain: domain || "",
    allowAnonymousParticipation: allowAnonymousParticipation || false,
  });
  // console.log("Card Data:", cardData);

  // console.log("Edited Data:", editedData);

  // // useEffect to extract Commun and Wilaya when location changes
  // useEffect(() => {
  //   if (location) {
  //     const [commun, wilaya] = location.split(", ");
  //     setEditedData((prevData) => ({ ...prevData, commun, wilaya }));
  //     console.log("Commun:", commun);
  //     console.log("Wilaya:", wilaya);
  //   }
  // }, [location]);

  // Handle input change
  const handleInputChange = (event, field) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    // console.log(`Handling input for ${field}: ${value}`);
    setEditedData((prevData) => ({ ...prevData, [field]: value }));
    // Update location when commun or wilaya changes
    if (field === "commun" || field === "wilaya") {
      const location = `${editedData.commune}, ${editedData.wilaya}`;
      // console.log("Updated Location:", location);
      setEditedData((prevData) => ({ ...prevData, location }));
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      console.log("Updating publication with data:", editedData);
      // Make the API call to update the publication
      const response = await updatePublicationMutation({ id: cardData._id, publicationData: editedData });

      // Check if the mutation was successful
      if (response.error) {
        console.error("Error updating publication:", response.error);
        // Optionally handle error here, e.g., display an error message to the user
      } else {
        console.log("Publication updated successfully:", response.data);
        onClose(); // Close the drawer after successful update
      }
    } catch (error) {
      console.error("An error occurred while updating publication:", error);
      // Optionally handle error here, e.g., display an error message to the user
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ width: "600px" }}>
      <Box sx={{ padding: 3, width: "600px" }}>
        <Typography variant="h6" gutterBottom>
          Edit Card
        </Typography>
        <form>
          <List>
            <ListItem>
              <ListItemText>
                <TextField label="Title" value={editedData.title} onChange={(e) => handleInputChange(e, "title")} fullWidth />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <TextField label="Type" value={editedData.type} onChange={(e) => handleInputChange(e, "type")} fullWidth />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <TextField label="Content" value={editedData.content} onChange={(e) => handleInputChange(e, "content")} fullWidth multiline rows={4} />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <TextField label="Start Date" type="date" value={editedData.startDate} onChange={(e) => handleInputChange(e, "startDate")} fullWidth />
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <TextField label="End Date" type="date" value={editedData.endDate} onChange={(e) => handleInputChange(e, "endDate")} fullWidth />
              </ListItemText>
            </ListItem>
            {/* Removed TextField components for Commun and Wilaya */}
            <ListItem>
              {/* <ListItemText>
                <LocationMenu
                  locations={algeriaCities} // Pass your locations data here
                  onSelectLocation={(location) => handleInputChange({ target: { value: location } }, "location")}
                  selectedLocation={`${editedData.commune}, ${editedData.wilaya}`} // Pass preselected location to LocationMenu
                />
              </ListItemText> */}
            </ListItem>
            <ListItem>
              <ListItemText>
                <Select label="Domain" value={editedData.domain} onChange={(e) => handleInputChange(e, "domain")} fullWidth>
                  <MenuItem value="transportation">Transportation</MenuItem>
                  <MenuItem value="education">Education</MenuItem>
                  <MenuItem value="healthcare">Healthcare</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedData.allowAnonymousParticipation}
                      onChange={(e) => handleInputChange(e, "allowAnonymousParticipation")}
                      inputProps={{
                        "aria-label": "allow anonymous participation",
                      }}
                    />
                  }
                  label="Allow Anonymous Participation"
                />
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="contained" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default CardDrawer;
