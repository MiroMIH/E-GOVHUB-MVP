import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, Button, FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination, Paper, Chip } from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import { green, red, purple, blue, orange } from "@mui/material/colors";

// Styles
const useStyles = makeStyles({
  card: {
    height: "100%",
  },
  fullWidthCard: {
    height: "100%",
    width: "100%",
  },
  centerContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  formControl: {
    minWidth: 120,
    marginBottom: 20,
  },
  chartContainer: {
    position: "relative",
    height: "50vh",
  },
  chip: {
    borderRadius: 4, // Making chips rectangular
  },
});

const CommentsView = ({ data }) => {
  const classes = useStyles();
  const [sentimentChartData, setSentimentChartData] = useState(null);
  const [languageChartData, setLanguageChartData] = useState(null);
  const [commentsData, setCommentsData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterSentiment, setFilterSentiment] = useState("all");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [timer, setTimer] = useState(60); // Initial timer set to 60 seconds
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data && data.data && data.data.allPublications) {
      // Extract sentiment chart data
      const sentimentData = {
        labels: ["Positive", "Negative", "Neutral"],
        datasets: [
          {
            label: "Sentiment Distribution",
            data: [data.data.sentimentDistribution.find((item) => item.sentiment === "positive")?.count || 0, data.data.sentimentDistribution.find((item) => item.sentiment === "negative")?.count || 0, data.data.sentimentDistribution.find((item) => item.sentiment === "neutral")?.count || 0],
            backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)", "rgba(255, 206, 86, 0.6)"],
          },
        ],
      };
      setSentimentChartData(sentimentData);

      // Extract language chart data
      const languageData = {
        labels: data.data.languageDistribution.map((item) => item.language),
        datasets: [
          {
            label: "Language Distribution",
            data: data.data.languageDistribution.map((item) => item.count),
            backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
          },
        ],
      };
      setLanguageChartData(languageData);

      // Extract comments data
      const allComments = data.data.allPublications.reduce((acc, publication) => {
        return acc.concat(publication.comments);
      }, []);
      setCommentsData(allComments);

      // Timer for next NLP execution
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            // Call the backend endpoint when timer runs out
            axios
              .get("http://localhost:5001/run-script")
              .then((response) => {
                console.log(response.data);
                window.location.reload(); // Reload the page after script execution
              })
              .catch((error) => {
                console.error("There was an error executing the script:", error);
              });
            return 60; // Reset timer
          } else {
            return prev - 1;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [data]);

  const handleRefreshSentiment = () => {
    // Call the backend endpoint manually
    axios
      .get("http://localhost:5001/run-script")
      .then((response) => {
        console.log(response.data);
        window.location.reload(); // Reload the page after script execution
      })
      .catch((error) => {
        console.error("There was an error executing the script:", error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterSentiment = (event) => {
    setFilterSentiment(event.target.value);
  };

  const handleFilterLanguage = (event) => {
    setFilterLanguage(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filteredComments = commentsData.filter((comment) => (filterSentiment === "all" || comment.sentiment === filterSentiment) && (filterLanguage === "all" || comment.language === filterLanguage));

  const getSentimentChipColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "#4caf50"; // Green
      case "negative":
        return "#f44336"; // Red
      default:
        return "#9e9e9e"; // Grey
    }
  };

  const getLanguageChipColor = (language) => {
    switch (language) {
      case "ar":
        return "#9c27b0"; // Purple
      case "fr":
        return "#2196f3"; // Blue
      case "en":
        return "#ff9800"; // Orange
      default:
        return "#9e9e9e"; // Grey
    }
  };

  return (
    <Grid container spacing={3} style={{ padding: "20px" }}>
      {/* Timer for Next NLP Execution */}
      <Grid item xs={12}>
        <Card className={classes.fullWidthCard}>
          <CardContent className={classes.centerContent}>
            <Typography variant="h6" component="h2">
              Next NLP Execution in: {timer}s
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleRefreshSentiment} style={{ marginLeft: "20px" }}>
              Run NLP Now
            </Button>
          </CardContent>
        </Card>
      </Grid>
      {/* Overview Section */}
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" gutterBottom>
          NLP Sentiment and Language Analysis
        </Typography>
      </Grid>
      {/* Sentiment Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6" component="h2">
              Sentiment Distribution
            </Typography>
            <div className={classes.chartContainer}>{sentimentChartData && <Pie data={sentimentChartData} />}</div>
          </CardContent>
        </Card>
      </Grid>
      {/* Language Distribution Chart */}
      <Grid item xs={12} md={6}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h6" component="h2">
              Language Distribution
            </Typography>
            <div className={classes.chartContainer}>{languageChartData && <Bar data={languageChartData} />}</div>
          </CardContent>
        </Card>
      </Grid>
      {/* Button to Open Dialog for Comments */}
      <Grid item xs={12}>
        <Card className={classes.fullWidthCard}>
          <CardContent className={classes.centerContent}>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
              View Comments and Filters
            </Button>
          </CardContent>
        </Card>
      </Grid>
      {/* Dialog for Comments and Filters */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Comments and Filters</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: "20px" }}>Filter the comments by sentiment and language.</DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" className={classes.formControl} fullWidth>
                <InputLabel>Filter by Sentiment</InputLabel>
                <Select value={filterSentiment} onChange={handleFilterSentiment} label="Filter by Sentiment">
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="positive">Positive</MenuItem>
                  <MenuItem value="negative">Negative</MenuItem>
                  <MenuItem value="neutral">Neutral</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" className={classes.formControl} fullWidth>
                <InputLabel>Filter by Language</InputLabel>
                <Select value={filterLanguage} onChange={handleFilterLanguage} label="Filter by Language">
                  <MenuItem value="all">All</MenuItem>
                  {data?.data?.languageDistribution?.map((lang) => (
                    <MenuItem key={lang.language} value={lang.language}>
                      {lang.language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Comment</TableCell>
                    <TableCell>Language</TableCell>
                    <TableCell>Sentiment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredComments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((comment) => (
                    <TableRow key={comment._id}>
                      <TableCell>{comment.content}</TableCell>
                      <TableCell>
                        <Chip label={comment.language} className={classes.chip} style={{ backgroundColor: getLanguageChipColor(comment.language) }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={comment.sentiment} className={classes.chip} style={{ backgroundColor: getSentimentChipColor(comment.sentiment) }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination component="div" count={filteredComments.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 25]} />
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default CommentsView;
