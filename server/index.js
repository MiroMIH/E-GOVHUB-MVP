import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from "helmet";
import morgan from "morgan";
import { exec } from "child_process"; // Import exec from child_process
import multer from 'multer';
import path from 'path';


// Import routes
import clientRoutes from "./routes/client.js";
import publicationRoutes from "./routes/publication.js";
import generalRoutes from "./routes/general.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import rejectEmailRoutes from "./routes/rejectionEmail.js";





// Import data models
import User from "./models/User.js";
import Comment from "./models/User.js";
import Publication from "./models/Publication.js";
import Registration from "./models/Registration.js";


// Import data to inject into the database
import { dataPublication, dataUser , frenchPublication , arabicPublication ,algerianPublication ,governmentProjects ,RegistrationData} from "./data/index.js";

dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('uploads'));
app.use(cors());


// ROUTES
app.use("/client", clientRoutes);
app.use("/publication", publicationRoutes);
app.use("/general",generalRoutes);
app.use("/auth",authRoutes);
app.use("/dashboard",dashboardRoutes);
app.use("/register",registrationRoutes);
app.use("/rejectEmail",rejectEmailRoutes);




// Root route
app.get("/", (request, response) => {
  // This function is called when someone makes a GET request to the root URL '/'
  return response.status(234).send("WELCOME TO EGOVHUB");
});


// Route for handling file uploads
// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files in the uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  }
});
const upload = multer({ storage: storage });
// Inside your app.post("/upload") route handler
app.post("/upload", upload.array('files[]'), (req, res) => {
  // Extract the first file name from the req.files array
  const firstFileName = req.files.length > 0 ? req.files[0].originalname : null;

  // Send the first file name as JSON in the response
  res.status(200).json({firstFileName });
});



//NLP ENDPOINT
// Endpoint to trigger the Python script
app.get("/run-script", (req, res) => {
  exec("py ./pythonScript/sentiment.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ error: error.message });
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return res.status(500).json({ error: stderr });
    }
    console.log(`Stdout: ${stdout}`);
    res.json({ message: "Script executed successfully", output: stdout });
  });
});



// POST ROUTES
// app.post("/client", addUser); // Assuming addUser is defined elsewhere

// MONGODB SETUP



// Define the port
const PORT = process.env.PORT || 9000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("App connected to DATABASE");

    // Start the server
    app.listen(PORT, () => {
      console.log(`app is listening to port : ${PORT}`);
    });

    // Insert initial data into the database
     //User.insertMany(dataUser);
     //Publication.insertMany(dataPublication);
    // Publication.insertMany(frenchPublication);
     //Publication.insertMany(arabicPublication);
     //Publication.insertMany(algerianPublication);
      //Publication.insertMany(governmentProjects);
      //Registration.insertMany(RegistrationData);
  })
  .catch((error) => {
    console.log(error);
  });
