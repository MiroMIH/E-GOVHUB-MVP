import mongoose from "mongoose";

const rejectionEmailSchema = new mongoose.Schema({
    recipient: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const RejectionEmail = mongoose.model('RejectionEmail', rejectionEmailSchema);

export default RejectionEmail;
