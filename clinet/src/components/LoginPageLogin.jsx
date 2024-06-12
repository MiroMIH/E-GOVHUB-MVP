import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const LoginPageLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data:", formData);

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("Login Response:", response);

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { token } = await response.json();
      console.log("Token:", token);

      // Store the token in localStorage
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage");

      // Redirect the user to the dashboard
      window.location.href = "/View Platform Statistics";
    } catch (error) {
      console.error("Login error:", error.message);
      // Handle login error
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 4,
        padding: 4,
        boxShadow: 2,
        width: "400px",
        minHeight: "350px",
      }}
    >
      <Typography variant="h6" sx={{ paddingTop: 2, paddingBottom: 2, color: "gray" }}>
        Login to your account
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
          InputProps={{
            style: { color: "black" }, // Change text color to black
          }}
         
        />
        <TextField
          name="password"
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          type="password"
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            style: { color: "black" }, // Change text color to black
          }}
         
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Typography variant="body2" sx={{ color: "gray", paddingTop: 1 }}>
            Forgot Password?
          </Typography>
          <Button variant="contained" type="submit" sx={{ width: "40%" }}>
            Login Now
          </Button>
        </Box>
      </form>
      <Box sx={{ display: "flex", alignItems: "center", width: "100%", paddingTop: 2 }}>
        <Typography variant="body2" sx={{ color: "gray" }}>
          Don't Have An Account?
        </Typography>
        <a href="/register" style={{ textDecoration: "none", color: "blue", marginLeft: 5 }}>
          Sign Up
        </a>
      </Box>
    </Box>
  );
};

export default LoginPageLogin;
