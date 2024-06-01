import express from "express";
import restrictToSuperadmin from "../middleware/restrictToSuperadmin.js";
import protect from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controller/dashboard.js";

const router = express.Router();


router.get("/statiques", getDashboardStats);

export default router;
