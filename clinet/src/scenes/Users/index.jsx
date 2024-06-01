import React, { useState } from "react";
import { Box, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Divider, RadioGroup, FormControlLabel, Radio, useTheme } from "@mui/material";
import { useGetUsersQuery, useAddUserMutation, useDeleteUserMutation, useUpdateUserMutation } from "../../state/api";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const Users = () => {
  const theme = useTheme();
  const { data, isLoading } = useGetUsersQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "citizen", // Default value for role
    status: "active", // Default value for status
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [addUser, { isLoading: isAddingUser }] = useAddUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Create a copy of the newUserData state and update the copy
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
        email: "",
        role: "",
        status: "",
      }
    );
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddOrUpdateUser = async () => {
    try {
      if (selectedUser) {
        // Destructure the password field and extract the rest of the userData
        const { password, ...userData } = newUserData;
        console.log("Updating user data:", userData); // Log updated user data
        await updateUser({ id: selectedUser.id, userData }); // Pass id and userData directly
      } else {
        console.log("Adding new user data:", newUserData); // Log new user data
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

  const columns = [
    { field: "id", headerName: "ID", flex: 1, editable: false },
    { field: "firstName", headerName: "First Name", flex: 1, editable: true },
    { field: "lastName", headerName: "Last Name", flex: 1, editable: true },
    { field: "email", headerName: "Email", flex: 1, editable: true },
    { field: "role", headerName: "Role", flex: 1, editable: true },
    { field: "status", headerName: "Status", flex: 1, editable: true },
    { field: "createdAt", headerName: "Created At", flex: 1, editable: false },
    { field: "updatedAt", headerName: "Updated At", flex: 1, editable: false },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      editable: false,
      renderCell: (params) => (
        <span style={{ cursor: "pointer" }}>
          <EditIcon color="success" onClick={() => openDialog(params.row)} />
          <DeleteIcon color="error" onClick={() => handleDeleteUser(params.row.id)} />
        </span>
      ),
    },
  ];

  const rows = data ? data.map((user) => ({ id: user._id, ...user })) : [];

  return (
    <Box m="2.5rem">
      <Header title="USERS" subtitle="List of Users" />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Box mt="40px">
          <Button onClick={() => openDialog()} variant="contained" color="primary" sx={{ mb: 2 }}>
            Add Record
          </Button>
          <Dialog open={isDialogOpen} onClose={closeDialog}>
            <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
            <DialogContent>
              {["firstName", "lastName", "email", "password"].map((field) => (
                <TextField key={field} autoFocus={field === "firstName"} margin="dense" id={field} label={field === "password" ? "Password" : field.charAt(0).toUpperCase() + field.slice(1)} type={field === "email" ? "email" : field === "password" ? "password" : "text"} fullWidth value={newUserData[field]} onChange={handleInputChange} />
              ))}
              <Box mt={2}>
                <Typography variant="subtitle1">Role</Typography>
                <RadioGroup
                  row
                  value={newUserData.role}
                  onChange={(e) =>
                    handleInputChange({
                      target: { id: "role", value: e.target.value },
                    })
                  }
                >
                  {["admin", "citizen", "superadmin"].map((option) => (
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
        </Box>
      )}
      <Card>
        <CardContent>
          <DataGrid loading={isLoading || !data} rows={rows} columns={columns} pageSize={5} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Users;
