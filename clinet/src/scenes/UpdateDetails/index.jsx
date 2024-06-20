import React, { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import EmailListSidebar from "../../components/EmailListSidebar"; // Assuming you have created EmailListSidebar component
import EmailContent from "../../components/EmailContent"; // Assuming you have created updated EmailContent component
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useGetAllEmailsQuery } from "../../state/api"; // Update with correct path to api.js

const UpdateDetailsPage = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const { data: emails, error, isLoading, refetch } = useGetAllEmailsQuery();

  const handleEmailDelete = (deletedEmailId) => {
    refetch(); // Refetch emails to update the list after deletion
  };

  // Render loading state or handle errors
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const emailList = emails || []; // Ensure emailList is initialized with an empty array if emails is undefined

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Demands Management
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          {/* Email List Sidebar */}
          <EmailListSidebar emailList={emailList} onEmailSelect={setSelectedEmail} />
        </Grid>
        <Grid item xs={9}>
          {/* Email Content Panel */}
          {selectedEmail ? (
            <EmailContent email={selectedEmail} onDelete={handleEmailDelete} />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                p: 3,
                border: "1px dashed grey",
                borderRadius: "8px",
              }}
            >
              <MailOutlineIcon sx={{ fontSize: 60, mb: 2, color: "grey.500" }} />
              <Typography variant="h6" color="textSecondary">
                Select a demand to view details.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UpdateDetailsPage;
