import React, { useState } from "react";
import { Grid, Button, Box, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Divider } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PublicationCard from "./PublicationCard";
import FlexBetween from "./FlexBetween";

const PublicationGrid = ({ publications, onCardClick }) => {
  const [view, setView] = useState("grid"); // State to toggle between views
  const [statusFilter, setStatusFilter] = useState("all"); // State to filter by status
  const [repeatFilter, setRepeatFilter] = useState("all"); // State to filter by repeat frequency

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
    repeat: publication.repeat,
  }));

  // Function to filter publications based on status and repeat frequency
  const filteredPublications = () => {
    let filtered = publications;

    // Apply status filter
    if (statusFilter === "ongoing") {
      filtered = filtered.filter((pub) => new Date(pub.endDate) >= new Date());
    } else if (statusFilter === "finished") {
      filtered = filtered.filter((pub) => new Date(pub.endDate) < new Date());
    }

    // Apply repeat filter
    if (repeatFilter !== "all") {
      filtered = filtered.filter((pub) => pub.repeat === repeatFilter);
    }

    return filtered;
  };

  return (
    <Box p={3}>
      <Button variant="contained" onClick={() => setView(view === "grid" ? "datatable" : "grid")} style={{ marginBottom: "1rem" }}>
        {view === "grid" ? "View All Publications" : "Back to Grid View"}
      </Button>

      {/* Render status filter and repeat filter in grid view */}
      {view === "grid" && (
        <Box mb={2} sx={{ display: "flex", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.1)", padding: "10px", borderRadius: "8px" }}>
          <FormControl component="fieldset" sx={{ marginRight: "20px" }}>
            <FormLabel component="legend">Status Filter</FormLabel>
            <RadioGroup row aria-label="status" name="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <FormControlLabel value="all" control={<Radio />} label="All" />
              <FormControlLabel value="ongoing" control={<Radio />} label="Ongoing" />
              <FormControlLabel value="finished" control={<Radio />} label="Finished" />
            </RadioGroup>
          </FormControl>

          <Divider orientation="vertical" flexItem sx={{ margin: "0 20px" }} />

          <FormControl component="fieldset">
            <FormLabel component="legend">Repeat Filter</FormLabel>
            <RadioGroup row aria-label="repeat" name="repeat-filter" value={repeatFilter} onChange={(e) => setRepeatFilter(e.target.value)}>
              <FormControlLabel value="all" control={<Radio />} label="All" />
              <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
              <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
              <FormControlLabel value="yearly" control={<Radio />} label="Yearly" />
            </RadioGroup>
          </FormControl>
        </Box>
      )}

      {/* Render publications based on view mode */}
      {view === "grid" ? (
        <Grid container spacing={3}>
          {filteredPublications().map((publication) => (
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
