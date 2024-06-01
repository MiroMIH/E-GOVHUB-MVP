import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import FlexBetween from "./FlexBetween";
import { Pie, Bar } from "react-chartjs-2";

const OverviewView = ({ data }) => {
  const [roleDistributionData, setRoleDistributionData] = useState(null);
  const [statusDistributionData, setStatusDistributionData] = useState(null);
  const [publicationTopicData, setPublicationTopicData] = useState(null);
  const [sentimentTrendData, setSentimentTrendData] = useState(null);

  useEffect(() => {
    // Ensure data is not undefined before accessing its properties
    if (data && data.data) {
      const { roleDistribution, statusDistribution, domainDistribution, sentimentTrend, recentPublications } = data.data;

      // Role Distribution Chart Data
      if (roleDistribution) {
        const roleLabels = roleDistribution.map((role) => role.role);
        const roleData = roleDistribution.map((role) => role.count);

        setRoleDistributionData({
          labels: roleLabels,
          datasets: [
            {
              label: "Role Distribution",
              data: roleData,
              backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
            },
          ],
        });
      }

      // Status Distribution Chart Data
      if (statusDistribution) {
        const statusLabels = statusDistribution.map((status) => status.status);
        const statusData = statusDistribution.map((status) => status.count);

        setStatusDistributionData({
          labels: statusLabels,
          datasets: [
            {
              label: "Status Distribution",
              data: statusData,
              backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
            },
          ],
        });
      }

      // Publication Topic Chart Data
      if (domainDistribution) {
        const topicLabels = domainDistribution.map((topic) => topic.domain);
        const topicCounts = domainDistribution.map((topic) => topic.count);

        setPublicationTopicData({
          labels: topicLabels,
          datasets: [
            {
              label: "Publication Topics",
              data: topicCounts,
              backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
            },
          ],
        });
      }

      // Sentiment Trend Chart Data
      if (sentimentTrend) {
        // Process sentiment trend data here
        // Example:
        // const sentimentLabels = sentimentTrend.map((item) => item.label);
        // const sentimentValues = sentimentTrend.map((item) => item.value);
        // setSentimentTrendData({
        //   labels: sentimentLabels,
        //   datasets: [
        //     {
        //       label: "Sentiment Trend",
        //       data: sentimentValues,
        //       // Add additional configuration as needed
        //     },
        //   ],
        // });
      }
    }
  }, [data]);

  return (
    <Grid container spacing={1} padding={"1rem"}>
      {/* Top row: 4 cards */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Total Users
            </Typography>
            <Typography variant="h4">{data?.data?.users || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Total Publications
            </Typography>
            <Typography variant="h4">{data?.data?.publications || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Total Comments
            </Typography>
            <Typography variant="h4">{data?.data?.comments || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Average Comments per Publication
            </Typography>
            <Typography variant="h4">{data?.data?.averageCommentsPerPublication?.toFixed(2) || 0}</Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Middle row: 3 cards */}

      <Grid item xs={12} md={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Role Distribution
            </Typography>
            {roleDistributionData && <Pie data={roleDistributionData} />}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Status Distribution
            </Typography>
            {statusDistributionData && <Bar data={statusDistributionData} />}
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Publication Topics
            </Typography>
            {publicationTopicData && <Bar data={publicationTopicData} />}
          </CardContent>
        </Card>
      </Grid>
      {/* Bottom row: 2 cards */}
      <Grid item xs={12} md={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              Most Recent Publications
            </Typography>
            <TableContainer component={Paper}>
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
                  {data?.data?.recentPublications.map((publication) => (
                    <TableRow key={publication._id}>
                      <TableCell>{publication.title}</TableCell>
                      <TableCell>{publication.wilaya}</TableCell>
                      <TableCell>{publication.commune}</TableCell>
                      <TableCell>{new Date(publication.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OverviewView;
