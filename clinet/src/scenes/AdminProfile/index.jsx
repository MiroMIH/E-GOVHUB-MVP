import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../../state/api";
import { Container, Box, Card, CardContent, CardHeader, CardActions, Avatar, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, Chip, Button, IconButton, Tooltip, Grow } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SecurityIcon from "@mui/icons-material/Security";

const AdminProfile = () => {
  const userId = useSelector((state) => state.global.userId);
  const { data } = useGetUserQuery(userId);
  const [cardClicked, setCardClicked] = useState(false);

  if (!data) {
    return <div>Loading...</div>;
  }

  const handleCardClick = () => {
    setCardClicked(true);
    setTimeout(() => setCardClicked(false), 300);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Admin Profile Page
      </Typography>
      <Typography variant="body1" gutterBottom align="center">
        Welcome to the Admin Profile page. Here you can view and edit your profile information.
      </Typography>
      <Grow in={true} timeout={1000}>
        <Card
          onClick={handleCardClick}
          sx={{
            mt: 3,
            transform: cardClicked ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <CardHeader avatar={<Avatar sx={{ bgcolor: "primary.main" }}>{data.firstName[0]}</Avatar>} title={`${data.firstName} ${data.lastName}`} subheader={`Role: ${data.role}`} />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Full Name" secondary={`${data.firstName} ${data.lastName}`} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText primary="Email" secondary={data.email} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <VerifiedUserIcon />
                </ListItemIcon>
                <ListItemText primary="Status" secondary={data.status} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Role" secondary={data.role} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grow>
    </Container>
  );
};

export default AdminProfile;
