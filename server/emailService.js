import nodemailer from 'nodemailer';

// Replace process.env.EMAIL and process.env.EMAIL_PASSWORD with your email and password directly
const email = 'egovhubmain@gmail.com'; // Your email address
const emailPassword = 'xtyc kcxx slkr stgg'; // Your email password

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service like Gmail, Yahoo, Outlook, etc.
  auth: {
    user: email,
    pass: emailPassword
  }
});

// Function to send rejection email
export const sendRejectionEmail = async (recipient, subject, content) => {
  try {
    const mailOptions = {
      from: email, // Sender address
      to: recipient, // Recipient address
      subject: subject, // Subject of the email
      text: content, // Plain text content
      html: `<p>${content}</p>` // HTML content (optional)
    };

    await transporter.sendMail(mailOptions);
    console.log('Rejection email sent successfully');
  } catch (error) {
    console.error('Failed to send rejection email:', error);
    throw error;
  }
};
