import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Chip, Box, Grow, IconButton, Menu, MenuItem } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import PublicationDetail from "./PublicationDetail";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardDrawer from "../components/CardDrawer";
import algeriaCitiesData from "../assets/algeria_cities.json"; // Import the Algeria cities JSON file
import { useDeletePublicationMutation } from "../state/api";
import TransportationIcon from "@mui/icons-material/LocalShipping";
import EducationIcon from "@mui/icons-material/School";
import HealthcareIcon from "@mui/icons-material/LocalHospital";
import OtherIcon from "@mui/icons-material/MoreHoriz";
import RepeatIcon from "@mui/icons-material/Repeat"; // Import RepeatIcon from Material-UI
import ScheduleIcon from "@mui/icons-material/Schedule";

const PublicationCard = ({ publication, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false); // State to manage detail view for this card
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false); // State to control the CardDrawer component
  const [deletePublicationMutation] = useDeletePublicationMutation();
  const [timeRemaining, setTimeRemaining] = useState("");

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleClick = () => {
    setShowDetail(true);
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

  const statusColors = {
    ongoing: "rgba(0, 255, 0, 0.2)", // Light green for ongoing
    cancelled: "rgba(255, 0, 0, 0.2)", // Light red for cancelled
    finished: "rgba(0, 0, 255, 0.2)", // Light blue for finished
  };

  const renderImage = () => {
    const domainIcons = {
      transportation: <TransportationIcon sx={{ fontSize: 64, color: "rgba(0, 0, 0, 0.5)" }} />,
      education: <EducationIcon sx={{ fontSize: 64, color: "rgba(0, 0, 0, 0.5)" }} />,
      healthcare: <HealthcareIcon sx={{ fontSize: 64, color: "rgba(0, 0, 0, 0.5)" }} />,
      other: <OtherIcon sx={{ fontSize: 64, color: "rgba(0, 0, 0, 0.5)" }} />,
    };

    if (!publication.photos || publication.photos.length === 0) {
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
          {domainIcon}
        </Box>
      );
    }

    const imageUrl = `${process.env.REACT_APP_BASE_URL}/${publication.photos[0].replace(/^uploads\//, "")}`;
    return <img src={imageUrl} alt="Publication" style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  };

  // Function to calculate and format time remaining until end date
  const calculateTimeRemaining = () => {
    const endDate = new Date(publication.endDate);
    const now = new Date();
    const difference = endDate.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      return "Expired";
    }
  };

  // Update time remaining periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Grow in={!showDetail}>
        <Card
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            backgroundColor: hovered ? "rgba(0, 0, 0, 0.2)" : statusColors[publication.status] || "rgba(0, 0, 0, 0.1)",
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
              top: "4px",
              right: "-12px",
              zIndex: 1,
              marginRight: "8px",
              marginLeft: "8px",
              marginTop: "8px",
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
                <span>{`Participation Options: ${publication.participationOptions.length > 0 ? publication.participationOptions.join(", ") : "No participation options available"}`}</span>
              </Typography>
            )}
          </CardContent>

          <CardContent sx={{ pt: 1 }}>
            <Chip label={publication.type.toUpperCase()} color={typeColors[publication.type]} size="small" sx={{ mr: 1, mb: 1, textTransform: "uppercase" }} />
            <Chip label={publication.domain.toUpperCase()} color={domainColors[publication.domain]} size="small" sx={{ mb: 1, mr: 1, textTransform: "uppercase" }} />
            <Chip label={publication.status.toUpperCase()} color={domainColors[publication.status]} size="small" sx={{ mb: 1, textTransform: "uppercase" }} />
          </CardContent>

          <CardContent sx={{ pt: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Chip label={`Time remaining: ${timeRemaining}`} icon={<ScheduleIcon />} color="secondary" variant="outlined" style={{ justifyContent: "center", borderRadius: "0%" }} />
          </CardContent>
          {/* Conditionally render RepeatIcon */}
          {publication.repeat !== "none" && (
            <IconButton
              aria-label="repeat"
              sx={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                zIndex: 1,
              }}
            >
              <RepeatIcon />
            </IconButton>
          )}
        </Card>
      </Grow>
      {showDetail && <PublicationDetail publication={publication} onClose={handleCloseDetail} />}
      {isDrawerOpen && <CardDrawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)} cardData={publication} algeriaCities={algeriaCitiesData} />}
    </>
  );
};

export default PublicationCard;
