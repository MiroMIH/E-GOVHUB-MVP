import express from "express";
import { getUsers, addUser, updateUser, deleteUser , getCitizenUsers} from "../controller/client.js"; // Import updateUser function from the controller
import restrictToSuperadmin from "../middleware/restrictToSuperadmin.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();

// Define routes
router.get("/users",restrictToSuperadmin, getUsers);
router.post("/users",restrictToSuperadmin, addUser);
router.put("/users/:id",restrictToSuperadmin, updateUser); // Route for updating a user by ID
router.delete("/users/:id",restrictToSuperadmin, deleteUser);
router.get("/usersCitizens",protect, getCitizenUsers);


export default router;
