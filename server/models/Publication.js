import mongoose from "mongoose";
import Comment from "./Comment.js"; // Import the Comment model

// Define publication types array
const publicationTypes = ['informative', 'poll', 'consultation'];

// Define Publication schema
const PublicationSchema = new mongoose.Schema({
  // Remove publicationId from the schema
  type: {
    type: String,
    required: true,
    enum: publicationTypes
  },
  title: {
    type: String,
    required: true,
    maxlength: 120
  },
  domain: {
    type: String,
    required: true,
    enum: ['transportation', 'education', 'healthcare', 'other']
  },
  content: {
    type: String,
    required: true
  },
  photos: {
    type: [String],
    validate: {
      validator: (photos) => photos.length <= 10,
      message: 'Maximum 10 photos allowed'
    }
  },
  videos: {
    type: [String],
    validate: {
      validator: (videos) => videos.length <= 5,
      message: 'Maximum 5 videos allowed'
    }
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  allowAnonymousParticipation: {
    type: Boolean,
    default: false
  },
  participationOptions: {
    type: [String],
  },
  participationResults: {
    type: Map,
    of: Number, // Define the results as a map of numbers
    default: {}
},
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Replace with your user model name
  },
  wilaya: {
    type: String, // Add wilaya field of type String
  },
  commune: {
    type: String, // Add commune field of type String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  comments: [Comment.schema] // Array of comments referencing the Comment schema
});

const Publication = mongoose.model('Publication', PublicationSchema);
export default Publication;
