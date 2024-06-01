import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme"; // Changed import path
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./scenes/layout"; // Changed import path
import Dashboard from "./scenes/dashboard"; // Changed import path
import Users from "./scenes/Users";
import UsersCitizens from "./scenes/UsersCitizens";
import Publications from "./scenes/Publications";
import LoginPage from "./scenes/LoginPage";
import Statiques from "./scenes/Statiques";
import AccountVerfication from "./scenes/AccountVerfication";
import AdminProfile from "./scenes/AdminProfile";


function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app"> 
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/View Platform Statistics" replace />} />
          <Route path="/Admin Account Management" element={<Users />} />
          <Route path="/Browse Publications" element={<Publications />} />
          <Route path="/Browse User List (Citizens)" element={<UsersCitizens />} />
          <Route path="/View Platform Statistics" element={<Statiques />} />
          <Route path="/Account Verification Requests Management" element={<AccountVerfication />} />
          <Route path="/Admin Profile" element={<AdminProfile/>} />
        </Route>
      </Routes>
    </ThemeProvider>
    </BrowserRouter>
    </div>
    
  );
}

export default App;
