import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Typography, Button, Divider, Box, TextField, FormControl, InputLabel, Select, MenuItem, Card, CardContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { EventOutlined } from "@mui/icons-material";
import { Pie, Bar } from "react-chartjs-2";
import { useGetCommentsQuery } from "../state/api";

const PublicationDetail = ({ publication, onClose }) => {
  const { data: comments = [], isLoading, isError } = useGetCommentsQuery(publication.comments); // Use the API query hook to fetch comments
  const [fetchedComments, setFetchedComments] = useState([]);

  useEffect(() => {
    if (comments) {
      setFetchedComments(comments);
    }
  }, [comments]);

  if (!publication || !publication.comments) {
    return null;
  }

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const renderImage = () => {
    if (!publication.photos || publication.photos.length === 0) {
      // No photos provided, display icon based on domain
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px", // Adjust the height as needed
            backgroundColor: "#f0f0f0",
            borderRadius: "4px", // Adjust border radius as needed
          }}
        >
          {/* Display the icon based on the domain */}
        </Box>
      );
    }

    const imageUrl = `${process.env.REACT_APP_BASE_URL}/${publication.photos[0].replace(/^uploads\//, "")}`;
    return <img src={imageUrl} alt="Publication" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />;
  };

  const renderParticipationCharts = () => {
    if (!publication.participationResults) return null;

    const chartData = {
      labels: Object.keys(publication.participationResults),
      datasets: [
        {
          label: "Participation",
          data: Object.values(publication.participationResults),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FF9800", "#9C27B0"],
        },
      ],
    };

    const cardStyle = {
      minWidth: 300, // Fixed width for the card
      height: "100%", // Ensures the card occupies full height
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    };

    const chartOptions = {
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    };

    return (
      <Box display="flex" gap={2} justifyContent="center">
        <Card sx={cardStyle}>
          <CardContent style={{ height: "100%" }}>
            <Pie data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
          </CardContent>
        </Card>
        <Card sx={cardStyle}>
          <CardContent style={{ height: "100%" }}>
            <Bar data={chartData} options={{ ...chartOptions, maintainAspectRatio: false }} />
          </CardContent>
        </Card>
      </Box>
    );
  };

  const getCommentBackgroundColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "rgba(129, 199, 132, 0.5)"; // greenish
      case "negative":
        return "rgba(239, 83, 80, 0.5)"; // reddish
      default:
        return "rgba(0, 0, 0, 0.1)"; // neutral
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent>
        <Box m="1.5rem">
          <Box bgcolor="#3f51b5" p="0.5rem" borderRadius="4px" mb={2} display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h4" component="h1" mb={2} color="white">
              {publication.title}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={2}>
            <EventOutlined sx={{ mr: 1 }} />
            <TextField type="datetime-local" value={formatDateForInput(publication.startDate)} InputProps={{ readOnly: true }} fullWidth />
            {publication.endDate && <TextField type="datetime-local" value={formatDateForInput(publication.endDate)} InputProps={{ readOnly: true }} fullWidth sx={{ ml: 2 }} />}
          </Box>
          <Divider />
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="body1">{publication.location}</Typography>
          </Box>
          <Box mb={2} borderRadius="4px" overflow="hidden">
            {renderImage()}
          </Box>
          <Divider />
          <Box my={2} bgcolor="rgba(0, 0, 0, 0.05)" p={2} borderRadius="4px">
            <Typography variant="h6" component="h2" mb={1}>
              Content
            </Typography>
            <Typography variant="body1" paragraph>
              {publication.content}
            </Typography>
          </Box>
          {publication.participationOptions && publication.participationOptions.length > 0 && (
            <>
              <Divider />
              <Box my={2}>
                <Typography variant="h6" component="h2" mb={1}>
                  Participation Results
                </Typography>
                <Box mt={2}>{renderParticipationCharts()}</Box>
              </Box>
            </>
          )}
          <Divider />
          <Box my={2} bgcolor="rgba(0, 0, 0, 0.05)" p={2} borderRadius="4px">
            <Typography variant="h6" component="h2" mb={1}>
              Comments
            </Typography>
            {comments.map((comment, index) => (
              <Box key={index} mb={2} p={2} bgcolor={getCommentBackgroundColor(comment.sentiment)} borderRadius="4px">
                <Typography variant="body1">{comment.content}</Typography>
                <Typography variant="body2" color="textSecondary">{`Posted by ${comment.fullName} on ${new Date(comment.createdAt).toLocaleString()}`}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Button aria-label="close" color="error" onClick={onClose} sx={{ m: 2 }}>
          <CloseIcon />
          <Typography variant="button" ml={1}>
            Close
          </Typography>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PublicationDetail;
