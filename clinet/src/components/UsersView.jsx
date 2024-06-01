import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Line, Bar, Pie } from "react-chartjs-2";

const UsersView = ({ data }) => {
  const [registrationData, setRegistrationData] = useState(null);
  const [chartType, setChartType] = useState("line"); // State to store selected chart type

  useEffect(() => {
    if (data && data.data && data.data.allUsers) {
      // Extract creation dates of users
      const registrationDates = data.data.allUsers.map((user) => new Date(user.createdAt));

      // Group registration dates by day
      const registrationCounts = {};
      registrationDates.forEach((date) => {
        const day = date.toLocaleDateString("default", { day: "2-digit", month: "short", year: "numeric" });
        registrationCounts[day] = (registrationCounts[day] || 0) + 1;
      });

      // Sort the dates to ensure the chart displays them in order
      const sortedDates = Object.keys(registrationCounts).sort((a, b) => new Date(a) - new Date(b));

      // Prepare data for chart
      const labels = sortedDates;
      const dataPoints = sortedDates.map((date) => registrationCounts[date]);

      setRegistrationData({
        labels: labels,
        datasets: [
          {
            label: "Registrations Over Time",
            data: dataPoints,
            fill: false,
            borderColor: "rgba(75, 192, 192, 0.6)",
            tension: 0.1,
          },
        ],
      });
    }
  }, [data]);

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  return (
    <Grid container justifyContent="center" spacing={3} style={{ padding: "20px" }}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" style={{ marginBottom: "20px" }}>
              Registrations Over Time
            </Typography>
            <FormControl variant="outlined" style={{ marginBottom: "20px", minWidth: 120 }}>
              <InputLabel>Chart Type</InputLabel>
              <Select value={chartType} onChange={handleChartTypeChange} label="Chart Type">
                <MenuItem value="line">Line</MenuItem>
                <MenuItem value="bar">Bar</MenuItem>
                <MenuItem value="pie">Pie</MenuItem>
              </Select>
            </FormControl>
            {registrationData && (chartType === "line" ? <Line data={registrationData} /> : chartType === "bar" ? <Bar data={registrationData} /> : <Pie data={registrationData} />)}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UsersView;
