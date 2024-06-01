import React, { useState, useEffect } from "react";
import { Box, Fade } from "@mui/material";
import LoginPageLogin from "../../components/LoginPageLogin";
import LoginPageLogo from "../../components/LoginPageLogo";
import LoginPageRegister from "../../components/LoginPageRegister";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 750); // Adjust timeout duration for animation speed (in milliseconds)

    return () => clearTimeout(timeout);
  }, []); // Empty dependency array to run effect only once on component mount

  return (
    <Box
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/mainBackground.jpg"})`, // Adjusted path
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box style={{ display: "flex", justifyContent: "center", paddingTop: "1%", filter: "brightness(1.2)" }}>
        <LoginPageLogo />
      </Box>
      <Box style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", marginTop: "-15%" }}>
        {/* Conditionally render Fade with login/register forms only when not loading */}
        <Fade in={!isLoading} timeout={1000}>
          <div>
            <LoginPageLogin />
            {/* <LoginPageRegister /> */}
          </div>
        </Fade>
      </Box>
    </Box>
  );
};

export default LoginPage;
