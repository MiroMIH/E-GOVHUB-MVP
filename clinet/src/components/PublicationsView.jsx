import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Pie, Bar, PolarArea } from "react-chartjs-2";

const PublicationsView = ({ data }) => {
  const [domainDistributionData, setDomainDistributionData] = useState(null);
  const [languageDistributionData, setLanguageDistributionData] = useState(null);
  const [recentPublications, setRecentPublications] = useState([]);
  const [polarChartData, setPolarChartData] = useState(null);
  const [chartType, setChartType] = useState("pie");

  useEffect(() => {
    if (data && data.data) {
      // Extract domain distribution data
      const domainDistribution = data.data.domainDistribution;
      const domainLabels = domainDistribution.map((item) => item.domain);
      const domainCounts = domainDistribution.map((item) => item.count);

      setDomainDistributionData({
        labels: domainLabels,
        datasets: [
          {
            label: "Domain Distribution",
            data: domainCounts,
            backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
          },
        ],
      });

      // Extract language distribution data
      const languageDistribution = data.data.languageDistribution;
      const languageLabels = languageDistribution.map((item) => item.language);
      const languageCounts = languageDistribution.map((item) => item.count);

      setLanguageDistributionData({
        labels: languageLabels,
        datasets: [
          {
            label: "Language Distribution",
            data: languageCounts,
            backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
          },
        ],
      });

      // Extract recent publications
      const recentPubs = data.data.recentPublications.slice(0, 5); // Get the first 5 recent publications
      setRecentPublications(recentPubs);

      // Sample polar area chart data (replace with actual data)
      const polarData = {
        labels: ["Positive", "Negative", "Neutral"],
        datasets: [
          {
            label: "Sentiment Distribution",
            data: [12, 19, 3],
            backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(255, 99, 132, 0.6)"],
          },
        ],
      };
      setPolarChartData(polarData);
    }
  }, [data]);

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  return (
    <Grid container spacing={3} style={{ padding: "20px" }}>
      {/* First row: Recent Publications taking full width */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" style={{ marginBottom: "20px" }}>
              Recent Publications
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Wilaya</TableCell>
                    <TableCell>Commune</TableCell>
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentPublications.map((pub) => (
                    <TableRow key={pub._id}>
                      <TableCell>{pub.title}</TableCell>
                      <TableCell>{pub.wilaya}</TableCell>
                      <TableCell>{pub.commune}</TableCell>
                      <TableCell>{new Date(pub.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      {/* Second row: Charts */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Domain Distribution
            </Typography>
            <FormControl variant="outlined" style={{ marginBottom: "20px", minWidth: 120 }}>
              <InputLabel>Chart Type</InputLabel>
              <Select value={chartType} onChange={handleChartTypeChange} label="Chart Type">
                <MenuItem value="pie">Pie</MenuItem>
                <MenuItem value="bar">Bar</MenuItem>
                <MenuItem value="polarArea">Polar Area</MenuItem>
              </Select>
            </FormControl>
            {domainDistributionData && (chartType === "pie" ? <Pie data={domainDistributionData} /> : chartType === "bar" ? <Bar data={domainDistributionData} /> : <PolarArea data={domainDistributionData} />)}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Language Distribution
            </Typography>
            {languageDistributionData && <Bar data={languageDistributionData} />}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Sentiment Distribution
            </Typography>
            {polarChartData && <PolarArea data={polarChartData} />}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PublicationsView;
