import Express  from "express";
import { getUser } from "../controller/general.js";
import protect from "../middleware/authMiddleware.js";

const router = Express.Router();

router.get("/user",protect,getUser);

export default router;