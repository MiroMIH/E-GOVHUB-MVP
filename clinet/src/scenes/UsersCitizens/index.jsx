import React, { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Divider, RadioGroup, FormControlLabel, Radio, Chip, useTheme, Grid } from "@mui/material";
import { useGetCitizenUsersQuery, useAddUserMutation, useDeleteUserMutation, useUpdateUserMutation } from "../../state/api";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // Icon for explanatory paragraph

const UsersCitizens = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetCitizenUsersQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    status: "active", // Default value for status
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [addUser, { isLoading: isAddingUser }] = useAddUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [id]: value,
    }));
  };

  const openDialog = (user = null) => {
    setIsDialogOpen(true);
    setSelectedUser(user);
    setNewUserData(
      user || {
        firstName: "",
        lastName: "",
        status: "active",
      }
    );
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddOrUpdateUser = async () => {
    try {
      if (selectedUser) {
        await updateUser({ id: selectedUser.id, userData: newUserData });
      } else {
        await addUser(newUserData);
      }
      closeDialog();
    } catch (error) {
      console.error(selectedUser ? "Failed to update user:" : "Failed to add user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const renderStatusChip = (status) => (
    <Chip
      label={status}
      style={{
        backgroundColor: status === "active" ? "green" : "red",
        color: "white",
      }}
    />
  );

  const columns = [
    { field: "firstName", headerName: "First Name", flex: 1, editable: true },
    { field: "lastName", headerName: "Last Name", flex: 1, editable: true },
    { field: "email", headerName: "Email", flex: 1, editable: true },
    { field: "role", headerName: "Role", flex: 1, editable: true },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      editable: true,
      renderCell: (params) => renderStatusChip(params.value),
    },
    { field: "createdAt", headerName: "Created At", flex: 1, editable: false },
    { field: "updatedAt", headerName: "Updated At", flex: 1, editable: false },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      editable: false,
      renderCell: (params) => (
        <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => openDialog(params.row)}>
          Edit
        </Button>
      ),
    },
  ];

  const rows = data ? data.map((user) => ({ id: user._id, ...user })) : [];

  return (
    <Box m="2.5rem">
      <Header title="Citizens" subtitle="List of Citizens" />
      <Grid container alignItems="center" spacing={3} sx={{ mb: 3 }}>
        <Grid item>
          <HelpOutlineIcon color="primary" fontSize="large" />
        </Grid>
        <Grid item>
          <Typography variant="body1">Manage and view details of citizens registered in the system. Add, edit, or delete users as required.</Typography>
        </Grid>
      </Grid>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Box mt="40px">
          <Dialog open={isDialogOpen} onClose={closeDialog}>
            <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
            <DialogContent>
              {["firstName", "lastName"].map((field) => (
                <TextField key={field} autoFocus={field === "firstName"} margin="dense" id={field} label={field.charAt(0).toUpperCase() + field.slice(1)} type="text" fullWidth value={newUserData[field]} onChange={handleInputChange} />
              ))}
              <Box mt={2}>
                <Typography variant="subtitle1">Status</Typography>
                <RadioGroup
                  row
                  value={newUserData.status}
                  onChange={(e) =>
                    handleInputChange({
                      target: { id: "status", value: e.target.value },
                    })
                  }
                >
                  {["active", "suspended"].map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.mode === "dark" ? theme.palette.grey[500] : "rgba(0, 0, 0, 0.54)",
                            "&.Mui-checked": {
                              color: theme.palette.success.main,
                            },
                          }}
                        />
                      }
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </Box>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ justifyContent: "center" }}>
              <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                <Button onClick={closeDialog} color="error" aria-label="Cancel">
                  <CloseIcon />
                  <Typography variant="body2" color="error">
                    Cancel
                  </Typography>
                </Button>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button onClick={handleAddOrUpdateUser} color="success" aria-label="Confirm" disabled={isAddingUser}>
                  <CheckIcon />
                  <Typography variant="body2" color="success">
                    {isAddingUser ? "Adding..." : "Confirm"}
                  </Typography>
                </Button>
              </Box>
            </DialogActions>
          </Dialog>

          <DataGrid loading={isLoading || !data} rows={rows} columns={columns} pageSize={5} />
        </Box>
      )}
    </Box>
  );
};

export default UsersCitizens;
