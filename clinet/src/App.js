// src/App.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { gsap } from "gsap";
import Layout from "./scenes/layout";
import Dashboard from "./scenes/dashboard";
import Users from "./scenes/Users";
import UsersCitizens from "./scenes/UsersCitizens";
import Publications from "./scenes/Publications";
import LoginPage from "./scenes/LoginPage";
import Statiques from "./scenes/Statiques";
import AccountVerfication from "./scenes/AccountVerfication";
import AdminProfile from "./scenes/AdminProfile";
import Loader from './components/Loader'; // Import the Loader component

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    // Simulate a data fetch or some async operation
    const timer = setTimeout(() => {
      gsap.to(contentRef.current, {
        duration: 1,
        opacity: 0,
        onComplete: () => setLoading(false),
      });
    }, 3000); // Replace with your actual async operation

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.to(contentRef.current, {
        duration: 1,
        opacity: 0.99,
      });
    }
  }, [loading]);

  return (
    <div className="app" ref={contentRef}>
      {loading ? (
        <Loader />
      ) : (
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
              <Route path="/LoginPage" element={<LoginPage />} />
              <Route element={<Layout />}>
                <Route
                path="/" element={<Navigate to="/View Platform Statistics" replace />} />
                <Route path="/Admin Account Management" element={<Users />} />
                <Route path="/Browse Publications" element={<Publications />} />
                <Route path="/Browse User List (Citizens)" element={<UsersCitizens />} />
                <Route path="/View Platform Statistics" element={<Statiques />} />
                <Route path="/Account Verification Requests Management" element={<AccountVerfication />} />
                <Route path="/Admin Profile" element={<AdminProfile />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
