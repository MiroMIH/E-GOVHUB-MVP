import React, { useState } from "react";
import { Grid, Button, Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PublicationCard from "./PublicationCard";

const PublicationGrid = ({ publications, onCardClick }) => {
  const [view, setView] = useState("grid"); // State to toggle between views

  // Check if publications is undefined or null
  if (!publications) {
    return null; // or a loading indicator if needed
  }

  // Define columns for the DataGrid
  const columns = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "content", headerName: "Content", width: 300 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "domain", headerName: "Domain", width: 150 },
    { field: "startDate", headerName: "Start Date", width: 200 },
    { field: "endDate", headerName: "End Date", width: 200 },
    { field: "location", headerName: "Location", width: 200 },
  ];

  // Map publication data to rows
  const rows = publications.map((publication) => ({
    id: publication._id,
    title: publication.title,
    content: publication.content,
    type: publication.type,
    domain: publication.domain,
    startDate: new Date(publication.startDate).toLocaleString(),
    endDate: new Date(publication.endDate).toLocaleString(),
    location: `${publication.commune}, ${publication.wilaya}`,
    allowAnonymousParticipation: publication.allowAnonymousParticipation ? "Yes" : "No",
  }));

  return (
    <Box p={3}>
      <Button variant="contained" onClick={() => setView(view === "grid" ? "datatable" : "grid")} style={{ marginBottom: "1rem" }}>
        {view === "grid" ? "View All Publications" : "Back to Grid View"}
      </Button>
      {view === "grid" ? (
        <Grid container spacing={3}>
          {publications.map((publication) => (
            <Grid item xs={12} sm={6} md={4} key={publication._id}>
              <PublicationCard publication={publication} onClick={() => onCardClick(publication.publicationId)} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div style={{ height: 600, width: "99%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            components={{
              Toolbar: GridToolbar, // Include the GridToolbar component for export functionality
            }}
          />
        </div>
      )}
    </Box>
  );
};

export default PublicationGrid;
