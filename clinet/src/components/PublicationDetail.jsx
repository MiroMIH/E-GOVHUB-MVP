import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Typography, Button, Divider, Box, TextField, FormControl, InputLabel, Select, MenuItem, Card, CardContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { EventOutlined } from "@mui/icons-material";
import { Pie, Bar, Line } from "react-chartjs-2";
import { useGetCommentsQuery } from "../state/api";

const PublicationDetail = ({ publication, onClose }) => {
  const { data: comments = [], isLoading, isError } = useGetCommentsQuery(publication.comments);
  const [fetchedComments, setFetchedComments] = useState([]);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [filteredDateData, setFilteredDateData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (comments) {
      setFetchedComments(comments);
    }
  }, [comments]);

  const prepareCommentData = () => {
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
    const commentDates = { positive: {}, negative: {} };

    fetchedComments.forEach((comment) => {
      sentimentCounts[comment.sentiment]++;
      const date = new Date(comment.createdAt).toLocaleDateString();
      if (comment.sentiment === "positive") {
        commentDates.positive[date] = (commentDates.positive[date] || 0) + 1;
      } else if (comment.sentiment === "negative") {
        commentDates.negative[date] = (commentDates.negative[date] || 0) + 1;
      }
    });

    const sentimentData = {
      labels: Object.keys(sentimentCounts),
      datasets: [
        {
          data: Object.values(sentimentCounts),
          backgroundColor: ["#4caf50", "#ffeb3b", "#f44336"],
        },
      ],
    };

    const dateLabels = Array.from(new Set([...Object.keys(commentDates.positive), ...Object.keys(commentDates.negative)]));

    const dateData = {
      labels: dateLabels,
      datasets: [
        {
          label: "Positive Comments",
          data: dateLabels.map((date) => commentDates.positive[date] || 0),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: false,
          tension: 0.1,
        },
        {
          label: "Negative Comments",
          data: dateLabels.map((date) => commentDates.negative[date] || 0),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: false,
          tension: 0.1,
        },
      ],
    };

    return { sentimentData, dateData };
  };

  const { sentimentData, dateData } = prepareCommentData();

  useEffect(() => {
    const filteredData = {
      labels: dateData.labels,
      datasets: [],
    };

    if (sentimentFilter === "all" || sentimentFilter === "positive") {
      filteredData.datasets.push(dateData.datasets[0]);
    }

    if (sentimentFilter === "all" || sentimentFilter === "negative") {
      filteredData.datasets.push(dateData.datasets[1]);
    }

    setFilteredDateData(filteredData);
  }, [sentimentFilter, dateData]);

  if (!publication || !publication.comments) {
    return null;
  }

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const renderImage = () => {
    if (!publication.photos || publication.photos.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
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
      minWidth: 300,
      height: "100%",
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
      animation: {
        duration: 50, // set to 0 to disable animation or a low value for faster animation
      },
    };

    return (
      <Box display="flex" gap={2} justifyContent="center">
        <Card sx={cardStyle}>
          <CardContent style={{ height: "100%" }}>
            <Pie data={chartData} options={{ ...chartOptions, maintainAspectRatio: false, animation: { duration: 50 } }} />
          </CardContent>
        </Card>
        <Card sx={cardStyle}>
          <CardContent style={{ height: "100%" }}>
            <Bar data={chartData} options={{ ...chartOptions, maintainAspectRatio: false, animation: { duration: 50 } }} />
          </CardContent>
        </Card>
      </Box>
    );
  };

  const getCommentBackgroundColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "rgba(129, 199, 132, 0.5)";
      case "negative":
        return "rgba(239, 83, 80, 0.5)";
      default:
        return "rgba(0, 0, 0, 0.1)";
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
                <Box mt={2}>
                  {renderParticipationCharts()}
                  <Button variant="outlined" color="primary" onClick={() => setIsStatsDialogOpen(true)} sx={{ mt: 2 }}>
                    View More Statistics
                  </Button>
                </Box>
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

        {/* Additional Statistics Dialog */}
        <Dialog open={isStatsDialogOpen} onClose={() => setIsStatsDialogOpen(false)} fullWidth maxWidth="md">
          <DialogContent>
            <Box m="1.5rem">
              <Box bgcolor="#3f51b5" p="0.5rem" borderRadius="4px" mb={2} display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h5" component="h2" color="white">
                  Additional Statistics and Filtering
                </Typography>
              </Box>
              <Divider />
              <Box mt={2}>
                <Typography variant="h6" component="h3" mb={1}>
                  More Charts
                </Typography>
                <Divider />
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  {/* Pie Chart for Sentiment Distribution */}
                  <Card sx={{ width: "100%" }}>
                    <CardContent>
                      <Typography variant="h6" component="h4" mb={2}>
                        Sentiment Distribution
                      </Typography>
                      <Box height="300px">
                        <Pie data={sentimentData} options={{ maintainAspectRatio: false, animation: { duration: 50 } }} />
                      </Box>
                    </CardContent>
                  </Card>
                  {/* Line Chart for Comments Over Time */}
                  <Card sx={{ width: "100%" }}>
                    <CardContent>
                      <Typography variant="h6" component="h4" mb={2}>
                        Comments Over Time
                      </Typography>
                      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel>Filter Sentiment</InputLabel>
                          <Select label="Filter Sentiment" value={sentimentFilter} onChange={(e) => setSentimentFilter(e.target.value)}>
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="positive">Positive</MenuItem>
                            <MenuItem value="negative">Negative</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box height="300px">
                        <Line data={filteredDateData} options={{ maintainAspectRatio: false, animation: { duration: 50 } }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
              <Button aria-label="close" color="error" onClick={() => setIsStatsDialogOpen(false)} sx={{ mt: 2 }}>
                <CloseIcon />
                <Typography variant="button" ml={1}>
                  Close
                </Typography>
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default PublicationDetail;
