// controllers/emailController.js

import Email from "../models/EmailShema.js";
import User from "../models/User.js"; // Adjust the path based on your file structure
import bcrypt from "bcryptjs";


// Get all emails with sender's full name
export const getEmails = async (req, res) => {
  try {
    // Fetch all emails
    const emails = await Email.find();

    // Extract unique sender IDs from emails
    const senderIds = [...new Set(emails.map(email => email.sender))];

    // Fetch user details for these sender IDs
    const users = await User.find({ _id: { $in: senderIds } });

    // Map users to an object for quick lookup
    const userMap = users.reduce((map, user) => {
      map[user._id] = `${user.firstName} ${user.lastName}`;
      return map;
    }, {});

    // Add fullName field to each email
    const emailsWithFullNames = emails.map(email => ({
      ...email._doc, // Spread the email document fields
      fullName: userMap[email.sender] || "Unknown User",
    }));

    res.json(emailsWithFullNames);
  } catch (err) {
    console.error("Error fetching emails with user names:", err);
    res.status(500).json({ message: err.message });
  }
};

// Create a new email
export const createEmail = async (req, res) => {
  const { sender, subject, date, content, type } = req.body;
  const email = new Email({
    sender,
    subject,
    date,
    content,
    type,
  });

  try {
    const newEmail = await email.save();
    res.status(201).json(newEmail);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete an email by ID
export const deleteEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const email = await Email.findByIdAndDelete(id);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.json({ message: "Email deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change user password
export const changeUserPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Fetch the user by ID
    const user = await User.findById(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Use a salt of 10 rounds

    // Update the user's password
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change user commune
export const changeUserCommune = async (req, res) => {
  const { id, commune } = req.body;
  console.log("🚀 ~ changeUserCommune ~ newCommune:", req.newCommune)
  console.log("🚀 ~ changeUserCommune ~ userId:", req.userId)

  try {
    // Fetch the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's commune
    user.commune = commune;

    // Save the updated user
    await user.save();

    res.json({ message: "Commune updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};