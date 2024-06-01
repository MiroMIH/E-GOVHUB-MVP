import User from "../models/User.js";

export const getUser = async (req, res) => {
    try {
      // Get the user ID from req.user
      const userId = req.user._id;

      // Fetch the user from the database using the ID
      const user = await User.findById(userId);
      
      if (!user) {
        // Handle case where user is not found
        return res.status(404).json({ message:
           'User not found' });
      }

      // Respond with the user object
      res.status(200).json(user);
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: error.message });
    }
};
