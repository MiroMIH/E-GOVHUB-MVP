import React, { useState, useEffect } from "react";
import { Container, Box, Button } from "@mui/material";
import PublicationGrid from "../../components/PublicationGrid";
import PublicationDetail from "../../components/PublicationDetail";
import Header from "../../components/Header";
import CreatePostDialog from "../../components/CreatePostDialog";
import { useGetAllPublicationsQuery } from "../../state/api"; // Update this import path with your actual API file path
import algeriaCitiesData from "../../assets/algeria_cities.json"; // Import the Algeria cities JSON file

const PublicationPage = () => {
  const { data: publications, error, isLoading } = useGetAllPublicationsQuery();
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [algeriaCities, setAlgeriaCities] = useState([]);

  useEffect(() => {
    // Function to fetch Algeria cities data
    const fetchAlgeriaCities = async () => {
      try {
        // Simulating fetching data from a JSON file
        // Replace this with your actual fetch logic
        // const response = await fetch("path/to/algeria_cities.json");
        // const data = await response.json();
        // Set the Algeria cities state with the fetched data
        setAlgeriaCities(algeriaCitiesData); // Replace `algeriaCitiesData` with your fetched data
      } catch (error) {
        console.error("Error fetching Algeria cities:", error);
      }
    };
    fetchAlgeriaCities(); // Call the fetchAlgeriaCities function
  }, []); // Empty dependency array to run only once when the component mounts

  const handleCardClick = (publicationId) => {
    const publication = publications.find(
      (pub) => pub.publicationId === publicationId
    );
    setSelectedPublication(publication);
  };

  const handleCloseDetail = () => {
    setSelectedPublication(null);
  };

  const handleCreatePostOpen = () => {
    setCreatePostOpen(true);
  };

  const handleCreatePostClose = () => {
    setCreatePostOpen(false);
  };

  return (
    <Box m="2.5rem">
      <Header
        title="Publications"
        subtitle="Browse and explore the latest publications"
        action={
          <Button variant="contained" onClick={handleCreatePostOpen}>
            Create Post
          </Button>
        }
      />
      <Box mt="1rem">
        <Button variant="contained" onClick={handleCreatePostOpen}>
          Create Post
        </Button>
      </Box>
      {selectedPublication ? (
        <Box mt="2.5rem">
          <PublicationDetail
            publication={selectedPublication}
            onClose={handleCloseDetail}
          />
        </Box>
      ) : (
        <PublicationGrid
          publications={publications} // Render fetched publications
          onCardClick={handleCardClick}
        />
      )}
      <CreatePostDialog
        open={isCreatePostOpen}
        onClose={handleCreatePostClose}
        algeriaCities={algeriaCities}
      />
    </Box>
  );
};

export default PublicationPage;
