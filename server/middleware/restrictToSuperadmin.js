import jwt from "jsonwebtoken";
import User from "../models/User.js";

const restrictToSuperadmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Token not provided or malformed" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, "your_secret_key_here");

    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    // Check if the user role is 'superadmin'
    if (user.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default restrictToSuperadmin;
