import mongoose from "mongoose";
import Comment from "./Comment.js"; // Import the Comment model

// Define publication types array
const publicationTypes = ['informative', 'poll', 'consultation'];

// Define repeat types array
const repeatTypes = ['none', 'weekly','yearly', 'monthly'];

// Define status types array
const statusTypes = ['ongoing', 'cancelled', 'finished'];

// Define Publication schema
const PublicationSchema = new mongoose.Schema({
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
    required: true // Assuming every publication should have a start date
  },
  endDate: {
    type: Date,
    required: true // Assuming every publication should have an end date
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
  repeat: {
    type: String,
    enum: repeatTypes,
    default: 'none' // Default to 'none' if not specified
  },
  status: {
    type: String,
    enum: statusTypes,
    default: 'ongoing' // Default to 'ongoing' if not specified
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

// Pre-save hook to automatically update the status based on dates
PublicationSchema.pre('save', function (next) {
  const now = new Date();
  if (this.endDate < now) {
    this.status = 'finished';
  } else if (this.startDate <= now && this.endDate >= now) {
    this.status = 'ongoing';
  }
  next();
});

const Publication = mongoose.model('Publication', PublicationSchema);
export default Publication;
