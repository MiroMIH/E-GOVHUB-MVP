import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  // Personal Information
  firstName: {
    type: String,
    // required: true,
    min: 2,
    max: 100,
  },
  lastName: {
    type: String,
    // required: true,
    min: 2,
    max: 100,
  },
  dateOfBirth: { type: Date },
  nationalIDNumber: { type: String }, // National ID Number
  // Contact Information
  address: { type: String },
  wilaya: {
    type: String, // Add wilaya field of type String
  },
  commune: {
    type: String, // Add commune field of type String
  },
  phoneNumber: { type: String },
  // Employment Information
  occupation: { type: String },
  employerName: { type: String },
  workAddress: { type: String },
  // Educational Background
  educationLevel: { type: String },
  institutionAttended: { type: String },
  degreeEarned: { type: String },
  // Preferences
  photos: [{ type: String }] // Array of file paths or URLs for photos
});

const Registration = mongoose.model('Registration', RegistrationSchema);

export default Registration;
