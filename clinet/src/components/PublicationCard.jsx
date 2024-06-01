import React, { useState } from "react";
import { Card, CardContent, Typography, Chip, Box, Grow, IconButton, Menu, MenuItem } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import PublicationDetail from "./PublicationDetail";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CreatePostDialog from "../components/CreatePostDialog";
import CardDrawer from "../components/CardDrawer";
import algeriaCitiesData from "../assets/algeria_cities.json"; // Import the Algeria cities JSON file
import { useDeletePublicationMutation } from "../state/api";
import TransportationIcon from "@mui/icons-material/LocalShipping";
import EducationIcon from "@mui/icons-material/School";
import HealthcareIcon from "@mui/icons-material/LocalHospital";
import OtherIcon from "@mui/icons-material/MoreHoriz";

const PublicationCard = ({ publication, onClick }) => {
  // console.log("🚀 ~ PublicationCard ~ publication:", publication);

  const [hovered, setHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false); // State to manage detail view for this card
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false); // State to control the CardDrawer component
  const [deletePublicationMutation] = useDeletePublicationMutation();

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleClick = () => {
    setShowDetail(true);
    // onClick(publication); // Remove this line, not needed anymore
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setDrawerOpen(true); // Open the CardDrawer component when edit is clicked
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      // Make the API call to delete the publication
      const response = await deletePublicationMutation(publication._id);

      // Check if the mutation was successful
      if (response.error) {
        console.error("Error deleting publication:", response.error);
        // Optionally handle error here, e.g., display an error message to the user
      } else {
        console.log("Publication deleted successfully:", response.data);
        // Optionally perform any cleanup or UI updates after successful deletion
      }
    } catch (error) {
      console.error("An error occurred while deleting publication:", error);
      // Optionally handle error here, e.g., display an error message to the user
    }

    handleMenuClose();
  };

  const typeColors = {
    informative: "primary",
    poll: "secondary",
    consultation: "warning",
  };

  const domainColors = {
    transportation: "info",
    education: "success",
    healthcare: "error",
    other: "default",
  };

  // console.log("Publication photo:", publication.photo); // Log publication photo data
  if (publication.photos && Array.isArray(publication.photos) && publication.photos.length > 0) {
    // console.log("First photo string:", publication.photos[0]);
  }

  const renderImage = () => {
    const domainIcons = {
      transportation: <TransportationIcon sx={{ fontSize: 64, color: "rgba(0, 0, 0, 0.5)" }} />,
      education: <EducationIcon sx={{ fontSize: 64, color: "rgba(0, 0, 0, 0.5)" }} />,
      healthcare: <HealthcareIcon sx={{ fontSize: 64, color: "rgba(0, 0, 0, 0.5)" }} />,
      other: <OtherIcon sx={{ fontSize: 64, color: "rgba(0, 0, 0, 0.5)" }} />,
    };

    if (!publication.photos || publication.photos.length === 0) {
      // No photos provided, display icon based on domain
      const domainIcon = domainIcons[publication.domain.toLowerCase()] || <OtherIcon sx={{ fontSize: 64, color: "rgba(0, 0, 0, 0.5)" }} />;
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            backgroundColor: "#f0f0f0",
          }}
        >
          {/* Display the icon based on the domain */}
          {domainIcon}
        </Box>
      );
    }

    const imageUrl = `${process.env.REACT_APP_BASE_URL}/${publication.photos[0].replace(/^uploads\//, "")}`;
    return <img src={imageUrl} alt="Publication" style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  };

  return (
    <>
      <Grow in={!showDetail}>
        <Card
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            backgroundColor: hovered ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s",
            position: "relative",
          }}
        >
          <IconButton
            aria-label="more"
            aria-controls="publication-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={{
              position: "absolute",
              top: "4px", // Added padding
              right: "-12px", // Added padding
              zIndex: 1,
              marginRight: "8px",
              marginLeft: "8px", // Added margin
              marginTop: "8px", // Added margin
            }}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            id="publication-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleEdit}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
          <CardContent onClick={handleClick}>
            <Typography variant="h5" component="h2" mb={1} mr={1}>
              {publication.title}
            </Typography>
            <Box
              sx={{
                height: "200px",
                backgroundColor: "#f0f0f0",
                mb: 1,
                width: "100%",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {renderImage()}
            </Box>
            <Typography color="textSecondary" variant="body2" mb={1} display="flex" alignItems="center">
              <EventIcon sx={{ fontSize: 16, marginRight: 1 }} />
              <span>{`Start Date: ${new Date(publication.startDate).toLocaleDateString()}`}</span>
            </Typography>
            <Typography color="textSecondary" variant="body2" mb={1} display="flex" alignItems="center">
              <LocationOnIcon sx={{ fontSize: 16, marginRight: 1 }} />
              <span>{`Wilaya: ${publication.wilaya}, Commune: ${publication.commune}`}</span>
            </Typography>
            {publication.participationOptions && Array.isArray(publication.participationOptions) && (
              <Typography color="textSecondary" variant="body2" mb={1} display="flex" alignItems="center">
                <GroupIcon sx={{ fontSize: 16, marginRight: 1 }} />
                <span>{`Participation Options: ${
                  publication.participationOptions.length > 0 ? publication.participationOptions.join(", ") : "No participation options available" // Add a fallback message
                }`}</span>
              </Typography>
            )}
          </CardContent>

          <CardContent sx={{ pt: 1 }}>
            <Chip label={publication.type.toUpperCase()} color={typeColors[publication.type]} size="small" sx={{ mr: 1, mb: 1, textTransform: "uppercase" }} />
            <Chip label={publication.domain.toUpperCase()} color={domainColors[publication.domain]} size="small" sx={{ mb: 1, textTransform: "uppercase" }} />
          </CardContent>
        </Card>
      </Grow>
      {showDetail && <PublicationDetail publication={publication} onClose={handleCloseDetail} />}
      {isDrawerOpen && ( // Render the CardDrawer component if isDrawerOpen is true
        <CardDrawer
          open={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          cardData={publication} // Pass the card data to the CardDrawer component
          algeriaCities={algeriaCitiesData}
        />
      )}
    </>
  );
};

export default PublicationCard;
