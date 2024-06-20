import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useChangeUserPasswordMutation } from "../state/api"; // Adjust the import path according to your project structure
import { useDeleteEmailMutation } from "../state/api"; // Import the deleteEmail mutation

const ChangePasswordDialog = ({ open, onClose, email }) => {
  const [newPassword, setNewPassword] = useState("");
  const [changeUserPassword] = useChangeUserPasswordMutation();
  const [deleteEmail] = useDeleteEmailMutation();

  const handleConfirm = async () => {
    try {
      await changeUserPassword({ email: email.sender, newPassword }).unwrap();
      await deleteEmail(email._id).unwrap(); // Delete the email after password change
      onClose();
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <TextField
          label="Old Password"
          value="********" // Placeholder for the old password
          InputProps={{ readOnly: true }}
          fullWidth
          margin="normal"
        />
        <TextField label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" fullWidth margin="normal" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
