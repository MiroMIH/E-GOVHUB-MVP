import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("🚀 ~ protect ~ req:", req)
    console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Token not provided or malformed');
      return res.status(401).json({ message: 'Token not provided or malformed' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    const decodedToken = jwt.verify(token, 'your_secret_key_here');
    console.log('Decoded Token:', decodedToken);

    const user = await User.findById(decodedToken.userId);
    console.log('Retrieved User:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};


export default protect;

