import Publication from "../models/Publication.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js"; // Adjust the path based on your file structure

export async function getAllPublications(req, res) {
    try {
        const publications = await Publication.find({}).populate('comments'); // Populate the 'comments' field
        res.status(200).json(publications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching publications" });
    }
}


export async function getPublicationById(req, res) {
    const { id } = req.params; // Extract publication ID from request parameters

    try {
        const publication = await Publication.findById(id); // Find by ID
        if (!publication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        res.status(200).json(publication);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching publication" });
    }
}
export async function createPublication(req, res) {
    // Check if file was uploaded successfully
    const publicationData = req.body; // Extract publication data from request body
    // publicationData.photos = req.file.path; // Add the file path to the publication data
    // publicationData.photos = null;
  
    try {
      // Extract commune and wilaya from the location string
      const [commune, wilaya] = publicationData.location.split(",");
  
      // Log the extracted commune and wilaya
      console.log("Commune:", commune);
      console.log("Wilaya:", wilaya);
  
      // Set commune and wilaya in the publicationData
      publicationData.commune = commune;
      publicationData.wilaya = wilaya;
  
      // Initialize participationResults with participation options from request body or example options
      const participationOptions = publicationData.participationOptions || ['option1', 'option2', 'option3']; // Use provided options or fallback to example options
      const initialParticipationResults = {};
      participationOptions.forEach(option => {
        initialParticipationResults[option] = 0;
      });
      publicationData.participationResults = initialParticipationResults;
  
      // Log the modified publicationData
      console.log("Publication Data:", publicationData);
  
      const newPublication = new Publication(publicationData); // Create a new instance of the Publication model
      await newPublication.save(); // Save the new publication to the database
      res.status(201).json({ publication: newPublication }); // Respond with the newly created publication and image URL
    } catch (error) {
      res.status(400).json({ message: error.message }); // Handle errors
    }
  }
  

  export async function updatePublication(req, res) {
    const { id } = req.params; // Extract publication ID from request parameters
    const updates = req.body; // Extract update data from request body

    console.log("Received request to update publication with ID:", id);
    console.log("Updates:", updates);

    try {
        // Find the publication by ID
        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({ message: "Publication not found" });
        }

        
        // Check if there is a comment to be added
        if (updates.comment) {
            // Create a new comment instance
            const newComment = new Comment({
                content: updates.comment.content,
                createdBy: updates.comment.createdBy,
                createdAt: updates.comment.createdAt
            });

            // Add the new comment to the comments array
            publication.comments.push(newComment);
        }

        // Check if there are votedOptions to be processed
        if (updates.votedOptions && Array.isArray(updates.votedOptions)) {
            // Initialize participationResults if it doesn't exist
            if (!publication.participationResults) {
                publication.participationResults = new Map();
            }

            // Iterate over each votedOption
            updates.votedOptions.forEach(option => {
                // Ensure the votedOption exists in participationOptions
                if (publication.participationOptions.includes(option)) {
                    // Increment the count for the option in participationResults
                    if (!publication.participationResults.has(option)) {
                        publication.participationResults.set(option, 0);
                    }
                    publication.participationResults.set(option, publication.participationResults.get(option) + 1);
                }
            });
        }

        // Update other fields (if any)
        for (const key in updates) {
            if (key !== "comment" && key !== "votedOptions") {
                publication[key] = updates[key];
            }
        }

        // Save the updated publication
        const updatedPublication = await publication.save();

        console.log("Publication updated successfully:", updatedPublication);
        res.status(200).json(updatedPublication);
    } catch (error) {
        console.error("Error updating publication:", error);
        res.status(500).json({ message: "Error updating publication" });
    }
}

export async function deletePublication(req, res) {
    const { id } = req.params; // Extract publication ID from request parameters

    try {
        const publication = await Publication.findByIdAndDelete(id); // Find and delete
        if (!publication) {
            return res.status(404).json({ message: "Publication not found" });
        }
        res.status(200).json({ message: "Publication deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting publication" });
    }
}





  // Async function to get comments with full user names
  export async function getCommentsWithUserNames(req, res) {
    try {
      const { comments } = req.body; // Assuming comments are sent in the request body
  
      if (!comments || !Array.isArray(comments)) {
        return res.status(400).json({ error: "Invalid comments data" });
      }
  
      // Fetch users who created these comments
      const userIds = comments.map((comment) => comment.createdBy);
  
      // Fetch users based on userIds
      const users = await User.find({ _id: { $in: userIds } });
  
      // Map users to an object for quick lookup
      const userMap = users.reduce((map, user) => {
        map[user._id] = `${user.firstName} ${user.lastName}`;
        return map;
      }, {});
  
      // Add fullName field to each comment
      const commentsWithFullNames = comments.map((comment) => ({
        ...comment,
        fullName: userMap[comment.createdBy] || "Unknown User",
      }));
  
      res.status(200).json(commentsWithFullNames);
    } catch (error) {
      console.error("Error fetching comments with user names:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  