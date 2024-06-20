import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import InfoIcon from "@mui/icons-material/Info";

const PublicationsView = ({ data }) => {
  const [domainDistributionData, setDomainDistributionData] = useState(null);
  const [filteredDomainData, setFilteredDomainData] = useState(null);
  const [languageDistributionData, setLanguageDistributionData] = useState(null);
  const [chartType, setChartType] = useState("pie");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [totalPublications, setTotalPublications] = useState(0);

  useEffect(() => {
    if (data && data.data) {
      // Extract domain distribution data
      const domainDistribution = data.data.domainDistribution || [];
      const domainLabels = domainDistribution.map((item) => item.domain);
      const domainCounts = domainDistribution.map((item) => item.count);

      const domainData = {
        labels: domainLabels,
        datasets: [
          {
            label: "Domain Distribution",
            data: domainCounts,
            backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
          },
        ],
      };

      setDomainDistributionData(domainData);
      setFilteredDomainData(domainData); // Initialize filtered data with all domain data

      // Extract language distribution data
      const languageDistribution = data.data.languageDistribution || [];
      const languageLabels = languageDistribution.map((item) => item.language);
      const languageCounts = languageDistribution.map((item) => item.count);

      const languageData = {
        labels: languageLabels,
        datasets: [
          {
            label: "Language Distribution",
            data: languageCounts,
            backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
          },
        ],
      };

      setLanguageDistributionData(languageData);

      // Total number of publications
      const totalPubs = data.data.publications || 0;
      setTotalPublications(totalPubs);
    }
  }, [data]);

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleDomainFilterChange = (event) => {
    const selectedDomain = event.target.value;
    setSelectedDomain(selectedDomain);

    if (selectedDomain === "") {
      setFilteredDomainData(domainDistributionData); // Show all domains when no filter selected
    } else {
      const filteredData = {
        labels: [selectedDomain],
        datasets: [
          {
            label: "Domain Distribution",
            data: [domainDistributionData.labels.indexOf(selectedDomain) !== -1 ? domainDistributionData.datasets[0].data[domainDistributionData.labels.indexOf(selectedDomain)] : 0],
            backgroundColor: ["rgba(255, 99, 132, 0.6)"],
          },
        ],
      };
      setFilteredDomainData(filteredData);
    }
  };

  return (
    <Grid container justifyContent="center" spacing={3} style={{ padding: "20px" }}>
      {/* Total Publications Chip at the Top */}

      {/* Domain Distribution Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" style={{ marginBottom: "20px", display: "flex" }}>
              <InfoIcon style={{ marginRight: "8px" }} />
              Domain Distribution
            </Typography>
            <Typography variant="body1" color="textSecondary" style={{ marginBottom: "20px" }}>
              This chart shows the distribution of publication domains. Use the dropdown to filter by domain.
            </Typography>
            <FormControl variant="outlined" style={{ marginBottom: "20px", minWidth: 120 }}>
              <InputLabel>Filter by Domain</InputLabel>
              <Select value={selectedDomain} onChange={handleDomainFilterChange} label="Filter by Domain">
                <MenuItem value="">All</MenuItem>
                {domainDistributionData &&
                  domainDistributionData.labels.map((domain, index) => (
                    <MenuItem key={index} value={domain}>
                      {domain}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {filteredDomainData &&
              filteredDomainData.labels &&
              filteredDomainData.datasets &&
              (chartType === "pie" ? (
                <Pie
                  data={filteredDomainData}
                  options={{
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function (tooltipItem) {
                            return `${filteredDomainData.labels[tooltipItem.index]}: ${filteredDomainData.datasets[0].data[tooltipItem.index]}`;
                          },
                        },
                      },
                    },
                  }}
                  width={200} // Adjusted size
                  height={200} // Adjusted size
                />
              ) : null)}
            <Typography variant="body2" color="textSecondary">
              Click on a slice to see details.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Language Distribution Card */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" style={{ marginBottom: "20px", display: "flex" }}>
              <InfoIcon style={{ marginRight: "8px" }} />
              Language Distribution
            </Typography>
            <Typography variant="body1" color="textSecondary" style={{ marginBottom: "20px" }}>
              This chart displays the distribution of publication languages. It provides insights into the prevalence of different languages used across publications.
            </Typography>
            {languageDistributionData && <Bar data={languageDistributionData} />}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PublicationsView;
