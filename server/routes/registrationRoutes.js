import Express from "express";
import { getAllRegistrationData,createRegistration,deleteRegistration} from "../controller/registration.js"; // Update the import statement if necessary
import protect from "../middleware/authMiddleware.js";

const router = Express.Router();

// Route to get all registration data
router.get("/registrations", getAllRegistrationData);
router.post("/registrations", createRegistration);
router.delete('/registration/:id', deleteRegistration);

export default router;
