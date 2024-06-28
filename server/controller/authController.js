// authController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Function to handle user login
// Function to handle user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const users = await User.find({ email });
    console.log('Email:', email);
    console.log('Password:', password);
    if (users.length === 0) {
      console.log('Email:', email);
      console.log('Password:', password);
      const allUsers = await User.find({}, { email: 1, password: 1 });
      return res.status(404).json({ email,password,users,message: 'User not found', allUsers });  
    }

    // Assuming there should be only one user with the provided email
    const user = users[0];

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // If authentication successful, generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role , commune:user.commune,status:user.status},
      'your_secret_key_here', // Replace with your actual secret key
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(200).json({ id: user._id, email: user.email, password: user.password, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Function to verify JWT token
export const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify the token
    const decodedToken = jwt.verify(token, 'your_secret_key_here'); // Replace with your actual secret key

    // Check if the user associated with the token exists
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user exists, token is valid
    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
