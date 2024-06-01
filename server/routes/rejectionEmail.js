import express from "express";
import { logRejectionEmail } from "../controller/rejectionEmailController.js";

const router = express.Router();

router.post('/log-rejection-email', logRejectionEmail);

export default router;
