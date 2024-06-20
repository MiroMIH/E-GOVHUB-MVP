import Express from "express";
import { 
  getEmails, 
  createEmail, 
  deleteEmail, 
  changeUserPassword, 
  changeUserCommune 
} from "../controller/emailController.js";
import protect from "../middleware/authMiddleware.js"; // Assuming you want to protect these routes

const router = Express.Router();

router.get("/", getEmails);
router.post("/", createEmail);
router.delete("/:id", deleteEmail);

// Add routes for changing user password and commune
router.put("/change-password", changeUserPassword);
router.put("/change-commune", changeUserCommune);

export default router;
