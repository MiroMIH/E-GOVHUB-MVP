import React, { useEffect, useState } from "react";
import { useGetRegistrationsQuery, useAddUserMutation, useDeleteRegistrationMutation } from "../../state/api";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, CircularProgress, IconButton, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox, Divider } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InfoIcon from "@mui/icons-material/Info";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5001";

const AccountVerification = () => {
  const { data, error, isLoading } = useGetRegistrationsQuery();
  const [selectedRow, setSelectedRow] = useState(null);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false); // Added
  const [rejectionReason, setRejectionReason] = useState("");
  const [addUser] = useAddUserMutation();
  const [deleteRegistration] = useDeleteRegistrationMutation();

  useEffect(() => {
    if (data) {
      console.log("Registration data:", data);
    }
  }, [data]);

  const handleDownload = async (photoUrl) => {
    const fullUrl = `${REACT_APP_BASE_URL}/${photoUrl}`;
    try {
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = photoUrl.split("/").pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(fullUrl, "_blank");
    }
  };

  // Inside the AccountVerification component
  const [rejectionFields, setRejectionFields] = useState({
    email: false,
    firstName: false,
    lastName: false,
    dateOfBirth: false,
    nationalIDNumber: false,
    address: false,
    wilaya: false,
    commune: false,
    phoneNumber: false,
    occupation: false,
    employerName: false,
    workAddress: false,
    educationLevel: false,
    institutionAttended: false,
    degreeEarned: false,
  });

  const handleCheckboxChange = (field) => {
    setRejectionFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleOpenRegisterDialog = (row) => {
    setSelectedRow(row);
    setOpenRegisterDialog(true);
  };

  const handleOpenRejectDialog = () => {
    setOpenRegisterDialog(false);
    setOpenRejectDialog(true);
  };

  const handleCloseDialogs = () => {
    setOpenRegisterDialog(false);
    setOpenRejectDialog(false);
    setOpenEmailDialog(false); // Added
    setSelectedRow(null);
    setRejectionReason("");
  };

  const handleRegisterUser = async () => {
    console.log("Registering user:", selectedRow);

    // Prepare user data for the API call
    const userData = {
      email: selectedRow.email,
      password: selectedRow.password, // Use the hashed password
      firstName: selectedRow.firstName,
      lastName: selectedRow.lastName,
      commune: selectedRow.commune,
      role: "citizen", // Default role
      status: "active", // Default status
    };
    console.log(selectedRow.commune);
    console.log("🚀 ~ handleRegisterUser ~ userData:", userData);

    try {
      // Call the addUser mutation
      const response = await addUser(userData).unwrap();
      console.log("User registered successfully:", response);
      await deleteRegistration(selectedRow._id).unwrap();
      console.log("Registration deleted successfully");
    } catch (error) {
      console.error("Failed to register user:", error);
    }

    handleCloseDialogs();
  };

  const handleRejectUser = async () => {
    console.log("Rejecting user:", selectedRow, "Reason:", rejectionReason);

    const selectedFields = Object.keys(rejectionFields).filter((field) => rejectionFields[field]);
    const emailContent = generateRejectionEmail(selectedFields, rejectionReason);

    try {
      // Call your backend API to send the rejection email
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/rejectEmail/log-rejection-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: selectedRow.email,
          subject: "Registration Rejection",
          content: emailContent,
        }),
      });

      if (response.ok) {
        console.log("Rejection email sent successfully.");
        await deleteRegistration(selectedRow._id).unwrap();
        // Show the email preview dialog
        setEmailPreview(emailContent);
      } else {
        console.error("Failed to send rejection email.");
      }
    } catch (error) {
      console.error("Failed to send rejection email:", error);
    }
  };

  const generateRejectionEmail = (fields, reason) => {
    let emailText = "Your registration has been rejected due to the following issues:\n\n";
    fields.forEach((field) => {
      emailText += `- ${field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}\n`;
    });
    if (reason) {
      emailText += `\nAdditional reason: ${reason}`;
    }
    return emailText;
  };

  const setEmailPreview = (content) => {
    setOpenEmailDialog(true);
    setEmailContent(content);
  };

  const handleSendEmail = async () => {
    // Mock function to simulate sending an email
    console.log("Sending email...");
    handleCloseDialogs();
  };

  const [emailContent, setEmailContent] = useState(""); // Added

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const columns = [
    { field: "email", headerName: "Email", width: 200 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "dateOfBirth", headerName: "Date of Birth", width: 150 },
    { field: "wilaya", headerName: "Wilaya", width: 100 },
    { field: "commune", headerName: "Commune", width: 100 },
    {
      field: "photos",
      headerName: "Photos",
      width: 150,
      renderCell: (params) =>
        params.value && params.value.length > 0 ? (
          <IconButton
            color="primary"
            onClick={() => handleDownload(params.value[0])} // Assuming there's only one photo
          >
            <DownloadIcon />
          </IconButton>
        ) : (
          <span>No photos</span>
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleOpenRegisterDialog(params.row)}>
          Verify
        </Button>
      ),
    },
  ];

  const rows = data.map((registration, index) => ({
    id: index + 1,
    ...registration,
  }));

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 1200 }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ mb: 2 }}>
            Registration Data
            <IconButton color="info" size="small" sx={{ ml: 1 }}>
              <InfoIcon />
            </IconButton>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            This table displays registrations from users. You can verify or reject registrations and download photos as needed.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ height: 600, width: "100%", overflowX: "auto" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              components={{
                Toolbar: GridToolbar,
              }}
            />
          </Box>
        </CardContent>
      </Card>
      {/* Register/Reject Dialog */}
      <Dialog open={openRegisterDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <DialogTitle>Verify User</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please review the information below carefully before verifying the user.
          </Typography>
          {selectedRow && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField label="Email" value={selectedRow.email} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="First Name" value={selectedRow.firstName} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Last Name" value={selectedRow.lastName} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Date of Birth" value={selectedRow.dateOfBirth} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="National ID" value={selectedRow.nationalIDNumber} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Address" value={selectedRow.address} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Wilaya" value={selectedRow.wilaya} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Commune" value={selectedRow.commune} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Phone Number" value={selectedRow.phoneNumber} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Occupation" value={selectedRow.occupation} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Employer Name" value={selectedRow.employerName} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Work Address" value={selectedRow.workAddress} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Education Level" value={selectedRow.educationLevel} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Institution Attended" value={selectedRow.institutionAttended} InputProps={{ readOnly: true }} fullWidth />
              <TextField label="Degree Earned" value={selectedRow.degreeEarned} InputProps={{ readOnly: true }} fullWidth />
            </Box>
          )}
          <Typography variant="body2" sx={{ mt: 2 }}>
            Ensure all the details above are correct before proceeding with the verification.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleRegisterUser} color="primary" variant="contained">
            Register User
          </Button>
          <Button onClick={handleOpenRejectDialog} color="secondary" variant="contained">
            Reject Registration
          </Button>
        </DialogActions>
      </Dialog>
      {/* Reject Reason Dialog */}
      <Dialog open={openRejectDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Reject User</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please select the fields that are incorrect:
          </Typography>
          {Object.keys(rejectionFields).map((field) => (
            <FormControlLabel key={field} control={<Checkbox checked={rejectionFields[field]} onChange={() => handleCheckboxChange(field)} name={field} />} label={field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} />
          ))}
          <TextField autoFocus margin="dense" label="Additional Rejection Reason" type="text" fullWidth value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectUser} color="secondary" variant="contained">
            Preview Email
          </Button>
          <Button onClick={handleCloseDialogs} color="primary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* Email Preview Dialog */}
      <Dialog open={openEmailDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
        <DialogTitle>Email Preview</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Recipient: {selectedRow && selectedRow.email}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {emailContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSendEmail} color="primary" variant="contained">
            Send Email
          </Button>
          <Button onClick={handleCloseDialogs} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountVerification;
