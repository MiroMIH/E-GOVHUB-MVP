import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useChangeUserCommuneMutation, useGetUserQuery } from "../state/api"; // Adjust the import path according to your project structure
import { useDeleteEmailMutation } from "../state/api"; // Import the deleteEmail mutation

const _communeNames = ["Alger Centre", "Sidi Mhamed", "El Madania", "Belouizdad", "Bab El Oued", "Bologhine", "Casbah", "Oued Koriche", "Bir Mourad Rais", "El Biar", "Bouzareah", "Birkhadem", "El Harrach", "Baraki", "Oued Smar", "Bourouba", "Hussein Dey", "Kouba", "Bachedjerah", "Dar El Beida", "Bab Azzouar", "Ben Aknoun", "Dely Ibrahim", "El Hammamet", "Rais Hamidou", "Djasr Kasentina", "El Mouradia", "Hydra", "Mohammadia", "Bordj El Kiffan", "El Magharia", "Beni Messous", "Les Eucalyptus", "Birtouta", "Tassala El Merdja", "Ouled Chebel", "Sidi Moussa", "Ain Taya", "Bordj El Bahri", "Marsa", "Haraoua", "Rouiba", "Reghaia", "Ain Benian", "Staoueli", "Zeralda", "Mahelma", "Rahmania", "Souidania", "Cheraga", "Ouled Fayet", "El Achour", "Draria", "Douera", "Baba Hassen", "Khracia", "Saoula"].sort((a, b) => a.localeCompare(b)); // Sort alphabetically

const ChangeLocationDialog = ({ open, onClose, email }) => {
  const [newCommune, setNewCommune] = useState("");
  const { data: user, isLoading, isError } = useGetUserQuery(email.sender, { skip: !open });
  const [changeUserCommune] = useChangeUserCommuneMutation();
  const [deleteEmail] = useDeleteEmailMutation();

  useEffect(() => {
    if (user) {
      // Initialize the commune dropdown with the sender's current commune
      setNewCommune(user.commune || "");
    }
  }, [user]);

  const handleConfirm = async () => {
    try {
      // Call the mutation to update the commune
      await changeUserCommune({ id: email.sender, commune: newCommune }).unwrap();
      await deleteEmail(email._id).unwrap(); // Delete the email after location change
      onClose();
    } catch (error) {
      console.error("Failed to change location:", error);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Typography color="error">Failed to load user information.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Location</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>New Location</InputLabel>
          <Select value={newCommune} onChange={(e) => setNewCommune(e.target.value)}>
            {_communeNames.map((commune) => (
              <MenuItem key={commune} value={commune}>
                {commune}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default ChangeLocationDialog;
