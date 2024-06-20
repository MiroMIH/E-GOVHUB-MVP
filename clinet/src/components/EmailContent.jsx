import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ClearIcon from "@mui/icons-material/Clear";
import { useDeleteEmailMutation } from "../state/api"; // Adjust the import path according to your project structure
import ChangePasswordDialog from "./ChangePasswordDialog"; // Adjust the import path according to your project structure
import ChangeLocationDialog from "./ChangeLocationDialog"; // Adjust the import path according to your project structure

const EmailContent = ({ email, onDelete }) => {
  const [deleteEmail, { isLoading, isError }] = useDeleteEmailMutation();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);

  const handleChangePassword = () => {
    setIsPasswordDialogOpen(true);
  };

  const handleChangeLocation = () => {
    setIsLocationDialogOpen(true);
  };

  const handleReject = async () => {
    try {
      await deleteEmail(email._id).unwrap();
      onDelete(email._id); // Notify parent that email is deleted
    } catch (error) {
      console.error("Failed to delete the email:", error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 1,
        boxShadow: 2,
        padding: 3,
        minHeight: "calc(100vh - 180px)",
      }}
    >
      <Box
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          padding: 2,
          borderRadius: 1,
          marginBottom: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: 1,
        }}
      >
        <Typography variant="h5" sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          {email.subject}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "info.main" }}>
          From: {email.fullName}
        </Typography>
      </Box>
      <Box
        sx={{
          fontSize: "1.2rem",
          lineHeight: "1.6",
          marginBottom: 2,
          height: "200px",
          overflowY: "auto",
          border: 1,
          padding: 2,
          borderRadius: 1,
          backgroundColor: "background.default",
        }}
      >
        <Typography variant="body2">{email.content}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: 1,
          paddingTop: 2,
          marginTop: 2,
        }}
      >
        <Button variant="contained" color="primary" sx={{ width: "100%", textTransform: "none", marginRight: 1 }} startIcon={<LockIcon />} onClick={handleChangePassword}>
          Change Password
        </Button>
        <Button variant="contained" color="secondary" sx={{ width: "100%", textTransform: "none", marginRight: 1 }} startIcon={<LocationOnIcon />} onClick={handleChangeLocation}>
          Change Location
        </Button>
        <Button
          variant="contained"
          sx={{
            width: "100%",
            textTransform: "none",
            backgroundColor: "error.main",
            color: "error.contrastText",
            "&:hover": {
              backgroundColor: "error.dark",
            },
          }}
          startIcon={<ClearIcon />}
          onClick={handleReject}
          disabled={isLoading}
        >
          Reject
        </Button>
      </Box>
      {isError && (
        <Typography color="error" sx={{ mt: 2 }}>
          Failed to delete the email. Please try again.
        </Typography>
      )}
      <ChangePasswordDialog open={isPasswordDialogOpen} onClose={() => setIsPasswordDialogOpen(false)} email={email} />
      <ChangeLocationDialog open={isLocationDialogOpen} onClose={() => setIsLocationDialogOpen(false)} email={email} />
    </Box>
  );
};

export default EmailContent;
