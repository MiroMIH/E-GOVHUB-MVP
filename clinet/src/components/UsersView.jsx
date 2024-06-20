import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, TextField, Chip } from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InfoIcon from "@mui/icons-material/Info";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import moment from "moment";

const UsersView = ({ data }) => {
  const [registrationData, setRegistrationData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [growthRate, setGrowthRate] = useState(null);

  useEffect(() => {
    if (data && data.data && data.data.allUsers) {
      const registrationDates = data.data.allUsers.map((user) => new Date(user.createdAt));

      const registrationCounts = {};
      registrationDates.forEach((date) => {
        const day = date.toLocaleDateString("default", { day: "2-digit", month: "short", year: "numeric" });
        registrationCounts[day] = (registrationCounts[day] || 0) + 1;
      });

      const sortedDates = Object.keys(registrationCounts).sort((a, b) => new Date(a) - new Date(b));

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
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            tension: 0.1,
          },
        ],
      });
      setFilteredData({
        labels: labels,
        datasets: [
          {
            label: "Registrations Over Time",
            data: dataPoints,
            fill: false,
            borderColor: "rgba(75, 192, 192, 0.6)",
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            tension: 0.1,
          },
        ],
      });

      // Calculate growth rate
      calculateGrowthRate(dataPoints);

      // Calculate number of users, active users, and suspended users
      const totalUsers = data.data.allUsers.length;
      const activeUsers = data.data.allUsers.filter((user) => user.isActive).length;
      const suspendedUsers = data.data.allUsers.filter((user) => user.isSuspended).length;

      setUsersStats({ totalUsers, activeUsers, suspendedUsers });
    }
  }, [data]);

  const calculateGrowthRate = (dataPoints) => {
    if (dataPoints.length > 1) {
      const latest = dataPoints[dataPoints.length - 1];
      const previous = dataPoints[dataPoints.length - 2];
      const growth = ((latest - previous) / previous) * 100;
      setGrowthRate(growth.toFixed(2));
    }
  };

  useEffect(() => {
    if (registrationData && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const filteredLabels = registrationData.labels.filter((label) => {
        const date = new Date(label);
        return date >= start && date <= end;
      });
      const filteredDataPoints = registrationData.datasets[0].data.filter((_, index) => {
        const date = new Date(registrationData.labels[index]);
        return date >= start && date <= end;
      });
      setFilteredData({
        labels: filteredLabels,
        datasets: [
          {
            ...registrationData.datasets[0],
            data: filteredDataPoints,
          },
        ],
      });
      calculateGrowthRate(filteredDataPoints);
    }
  }, [startDate, endDate, registrationData]);

  const [usersStats, setUsersStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
  });

  return (
    <Grid container justifyContent="center" spacing={3} style={{ padding: "20px" }}>
      <Grid item xs={12}>
        <Typography variant="h4" component="h1" style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
          <InfoIcon style={{ marginRight: "8px" }} />
          User Registration Analytics
        </Typography>
        <Typography variant="body1" color="textSecondary" style={{ marginBottom: "20px" }}>
          This section provides insights into user registration trends over time. The charts below display the number of registrations on a daily basis. You can also filter the data by selecting a specific date range.
        </Typography>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker label="Start Date" value={startDate} sx={{ marginRight: "20px" }} onChange={(newValue) => setStartDate(newValue)} renderInput={(params) => <TextField {...params} />} />
          <DatePicker label="End Date" value={endDate} onChange={(newValue) => setEndDate(newValue)} renderInput={(params) => <TextField {...params} />} />
        </LocalizationProvider>
        {growthRate !== null && <Chip label={`Growth Rate: ${growthRate}%`} color="primary" style={{ marginLeft: "10px" }} />}
        <Chip label={`Total Users: ${usersStats.totalUsers}`} style={{ marginLeft: "10px" }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <ShowChartIcon sx={{ marginRight: "8px" }} />
              Line Chart
            </Typography>
            {filteredData && (
              <Line
                data={filteredData}
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (tooltipItem) {
                          return `Registrations: ${tooltipItem.raw}`;
                        },
                      },
                    },
                  },
                }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <BarChartIcon style={{ marginRight: "8px" }} />
              Bar Chart
            </Typography>
            {filteredData && (
              <Bar
                data={filteredData}
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (tooltipItem) {
                          return `Registrations: ${tooltipItem.raw}`;
                        },
                      },
                    },
                  },
                }}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UsersView;
