// rejectionEmailController.js
import { sendRejectionEmail } from '../emailService.js'; // Note the addition of '.js'

export const logRejectionEmail = async (req, res) => {
  try {
    const { recipient, subject, content } = req.body;

    // Log the rejection email information
    console.log('Rejection Email Information:');
    console.log('Recipient:', recipient);
    console.log('Subject:', subject);
    console.log('Content:', content);

    // Send the rejection email
    await sendRejectionEmail(recipient, subject, content);

    res.status(200).json({ message: 'Rejection email sent and logged successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to send and log rejection email.', error: error.message });
  }
};
