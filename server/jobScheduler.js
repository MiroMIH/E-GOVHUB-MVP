import cron from 'node-cron';
import mongoose from 'mongoose';
import Publication from './models/Publication.js'; // Adjust the path as needed
import { exec } from 'child_process';

// Function to update the status of all publications
const updatePublicationStatuses = async () => {
  const now = new Date();
  try {
    const publications = await Publication.find();
    for (let publication of publications) {
      let oldStatus = publication.status;
      if (publication.endDate < now) {
        publication.status = 'finished';
      } else if (publication.startDate <= now && publication.endDate >= now) {
        publication.status = 'ongoing';
      }

      // Log the changes to the console
      if (oldStatus !== publication.status) {
        console.log(`Publication ${publication._id} status changed from ${oldStatus} to ${publication.status}`);
      }

      await publication.save();
    }
    console.log('Publication statuses updated successfully.');
  } catch (error) {
    console.error('Error updating publication statuses:', error);
  }
};

// Function to update publication dates based on repeating frequency
const updatePublicationDates = async () => {
  try {
    // Fetch all publications that have repeating frequency defined
    const publications = await Publication.find({ repeat: { $in: ['weekly', 'monthly', 'yearly'] } });
    console.log("Fetched publications:", publications);

    // Log the fetched publications for debugging
    for (let publication of publications) {
      console.log(`Fetched publication ${publication._id}: startDate = ${publication.startDate}, endDate = ${publication.endDate}, repeat = ${publication.repeat}`);

      const currentDate = new Date();
      const lastActiveDate = new Date(publication.startDate);

      console.log("Current date:", currentDate);
      console.log("Last active date:", lastActiveDate);

      if (publication.repeat === 'weekly') {
        // Check if it's been a week since last active
        const weekDifference = (currentDate - lastActiveDate) / (1000 * 60 * 60 * 24 * 7);
        console.log("Week difference:", weekDifference);

        if (weekDifference >= 1) {
          console.log(`Updating weekly publication ${publication._id}`);
          console.log(`Before update: startDate = ${publication.startDate}, endDate = ${publication.endDate}`);

          // Update start and end dates by adding one week
          publication.startDate = new Date(publication.startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          publication.endDate = new Date(publication.endDate.getTime() + 7 * 24 * 60 * 60 * 1000);

          // Log the changes to the console
          console.log(`Updated dates: startDate = ${publication.startDate}, endDate = ${publication.endDate}`);

          // Ensure date fields are JavaScript Date objects
          console.log("startDate type:", typeof publication.startDate);
          console.log("endDate type:", typeof publication.endDate);

          // Save the updated publication
          try {
            await publication.save();
            console.log(`Successfully saved publication ${publication._id}`);
          } catch (saveError) {
            console.error(`Error saving publication ${publication._id}:`, saveError);
          }
        }
      } else if (publication.repeat === 'monthly') {
        // Check if it's been a month since last active
        if (currentDate.getMonth() > lastActiveDate.getMonth() || currentDate.getFullYear() > lastActiveDate.getFullYear()) {
          console.log(`Updating monthly publication ${publication._id}`);
          console.log(`Before update: startDate = ${publication.startDate}, endDate = ${publication.endDate}`);

          // Update start and end dates by adding one month
          publication.startDate.setMonth(publication.startDate.getMonth() + 1);
          publication.endDate.setMonth(publication.endDate.getMonth() + 1);

          // Log the changes to the console
          console.log(`Updated dates: startDate = ${publication.startDate}, endDate = ${publication.endDate}`);

          // Ensure date fields are JavaScript Date objects
          console.log("startDate type:", typeof publication.startDate);
          console.log("endDate type:", typeof publication.endDate);

          // Save the updated publication
          try {
            await publication.save();
            console.log(`Successfully saved publication ${publication._id}`);
          } catch (saveError) {
            console.error(`Error saving publication ${publication._id}:`, saveError);
          }
        }
      } else if (publication.repeat === 'yearly') {
        // Check if it's been a year since last active
        if (currentDate.getFullYear() > lastActiveDate.getFullYear()) {
          console.log(`Updating yearly publication ${publication._id}`);
          console.log(`Before update: startDate = ${publication.startDate}, endDate = ${publication.endDate}`);

          // Update start and end dates by adding one year
          publication.startDate.setFullYear(publication.startDate.getFullYear() + 1);
          publication.endDate.setFullYear(publication.endDate.getFullYear() + 1);

          // Log the changes to the console
          console.log(`Updated dates: startDate = ${publication.startDate}, endDate = ${publication.endDate}`);

          // Ensure date fields are JavaScript Date objects
          console.log("startDate type:", typeof publication.startDate);
          console.log("endDate type:", typeof publication.endDate);

          // Save the updated publication
          try {
            await publication.save();
            console.log(`Successfully saved publication ${publication._id}`);
          } catch (saveError) {
            console.error(`Error saving publication ${publication._id}:`, saveError);
          }
        }
      }
    }

    console.log('Publication dates updated successfully.');
  } catch (error) {
    console.error('Error updating publication dates:', error);
  }
};

// Combine both functions into a single cron job
cron.schedule('*/1 * * * *', async () => {
  console.log('Running the combined job');
  await updatePublicationDates(); // Update publication dates
  await updatePublicationStatuses(); // Update statuses
  exec("py ./pythonScript/sentiment.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running sentiment analysis script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Sentiment script stderr: ${stderr}`);
      return;
    }
    console.log(`Sentiment script stdout: ${stdout}`);
  }); 
});
