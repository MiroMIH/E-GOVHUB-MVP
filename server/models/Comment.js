import mongoose from "mongoose";

// Define Comment schema
const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the user who made the comment
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  language: {
    type: String,
    enum: ['ar', 'en', 'fr'], // Restrict language to Arabic, English, and French
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'], // Define available sentiment values
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;