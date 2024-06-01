import React, { useState, useEffect } from "react";
import { Tabs, Tab, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../../components/Header";
import OverviewView from "../../components/OverviewView";
import UsersView from "../../components/UsersView";
import PublicationsView from "../../components/PublicationsView";
import CommentsView from "../../components/CommentsView";
import { useGetDashboardStatsQuery } from "../../state/api";

const Statiques = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const theme = useTheme();
  const { data, error, isLoading } = useGetDashboardStatsQuery();

  useEffect(() => {
    console.log("Dashboard Stats Data:", data);
  }, [data]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className={theme.palette.mode === "light" ? "light-mode" : "dark-mode"}>
      <Tabs value={selectedTab} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab value="overview" label="Overview" />
        <Tab value="users" label="Users" />
        <Tab value="pubs" label="Publications" />
        <Tab value="comments" label="Comments" />
      </Tabs>

      <Typography variant="h6" gutterBottom>
        {selectedTab === "" && ""}
        {selectedTab === "" && ""}
        {selectedTab === "" && ""}
        {selectedTab === "" && ""}
      </Typography>

      {/* Render different views based on the selectedTab */}
      {selectedTab === "overview" && <OverviewView data={data} />}
      {selectedTab === "users" && <UsersView data={data} />}
      {selectedTab === "pubs" && <PublicationsView data={data} />}
      {selectedTab === "comments" && <CommentsView data={data} />}
    </div>
  );
};

export default Statiques;
