import React from "react";
import { Grid } from "@mui/material";
import PublicationCard from "./PublicationCard";

const PublicationGrid = ({ publications, onCardClick }) => {
  console.log("🚀 ~ PublicationGrid ~ publications:", publications);
  // Check if publications is undefined or null
  if (!publications) {
    return null; // or a loading indicator if needed
  }

  return (
    <Grid container spacing={3} mt="1.5rem">
      {publications.map((publication) => (
        <Grid item xs={12} sm={6} md={4} key={publication._id}>
          <PublicationCard publication={publication} onClick={() => onCardClick(publication.publicationId)} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PublicationGrid;
