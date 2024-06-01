import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["admin", "superadmin"] } }); // Find users with role 'admin' or 'superadmin'
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addUser = async (req, res) => {
  const { email, password, firstName, lastName, role, status } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Use a salt of 10 rounds

    // Create a new user with hashed password
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      status,
    });

    // Save the user to the database
    await newUser.save();

    // Send the newly created user in the response
    res.status(201).json(newUser);
  } catch (error) {
    // If an error occurs during user creation, send an error response
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id); // Use findByIdAndDelete instead of findByIdAndRemove
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCitizenUsers = async (req, res) => {
  try {
    // Find users with role 'citizen'
    const citizens = await User.find({ role: "citizen" });

    // Send the filtered users in the response
    res.status(200).json(citizens);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
