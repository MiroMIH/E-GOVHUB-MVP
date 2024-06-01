// Import the Registration model
import Registration from "../models/Registration.js";
import bcrypt from 'bcryptjs';


export const getAllRegistrationData = async (req, res) => {
    try {
        // Fetch all registration data from the database
        const registrations = await Registration.find();
        
        // Respond with the registration data
        res.status(200).json(registrations);
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: error.message });
    }
};


export const createRegistration = async (req, res) => {
    try {
        console.log("Received request to create new registration.");

        // Extract registration data from request body
        const {
            email,
            password,
            firstName,
            lastName,
            dateOfBirth,
            nationalIDNumber,
            address,
            wilaya,
            commune,
            phoneNumber,
            occupation,
            employerName,
            workAddress,
            educationLevel,
            institutionAttended,
            degreeEarned,
            photos
        } = req.body;

        console.log("Extracted registration data from request body:", req.body);

        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10); // Use a salt of 10 rounds

        // Create a new registration instance with hashed password
        const newRegistration = new Registration({
            email,
            password,
            firstName,
            lastName,
            dateOfBirth,
            nationalIDNumber,
            address,
            wilaya,
            commune,
            phoneNumber,
            occupation,
            employerName,
            workAddress,
            educationLevel,
            institutionAttended,
            degreeEarned,
            photos
        });

        console.log("Created new registration instance:", newRegistration);

        // Save the registration to the database
        await newRegistration.save();

        console.log("Saved registration to the database.");

        // Respond with success message
        res.status(201).json({ message: "Registration created successfully", registration: newRegistration });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error occurred while creating registration:", error);
        res.status(500).json({ message: error.message });
    }
};


// Controller to delete a registered user by ID
export const deleteRegistration = async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const { id } = req.params;

        // Find and delete the user by ID
        const deletedRegistration = await Registration.findByIdAndDelete(id);

        // If the user is not found, respond with a 404 status code
        if (!deletedRegistration) {
            return res.status(404).json({ message: "Registration not found" });
        }

        // Respond with a success message
        res.status(200).json({ message: "Registration deleted successfully" });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: error.message });
    }
};