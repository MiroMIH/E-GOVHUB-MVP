import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    minHeight: "calc(100vh - 180px)", // Adjust the height as needed
  },
}));

const EmailActionsPanel = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Email Actions
      </Typography>
      {/* Add action buttons or other components here */}
      <Button variant="contained" color="primary">
        Reply
      </Button>
      <Button variant="contained" color="secondary" style={{ marginLeft: "8px" }}>
        Forward
      </Button>
    </Box>
  );
};

export default EmailActionsPanel;
