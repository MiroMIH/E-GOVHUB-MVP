// authRoutes.js

import express from "express";
import { loginUser, verifyToken } from "../controller/authController.js"; // Import controller functions

const router = express.Router();

// Login route
router.post('/login', loginUser);

// Token verification route
router.post('/verify-token', verifyToken);

export default router;
