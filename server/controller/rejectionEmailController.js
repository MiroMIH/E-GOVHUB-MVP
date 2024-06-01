
export const logRejectionEmail = async (req, res) => {
    try {
      const { recipient, subject, content } = req.body;
      console.log("Rejection Email Information:");
      console.log("Recipient:", recipient);
      console.log("Subject:", subject);
      console.log("Content:", content);
      res.status(200).json({ message: "Rejection email information logged successfully." });
    } catch (error) {
      res.status(400).json({ message: "Failed to log rejection email information.", error: error.message });
    }
  };
  