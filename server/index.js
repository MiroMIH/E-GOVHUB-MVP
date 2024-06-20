import express from "express";
import https from "https"; // Import the HTTPS module
import fs from "fs"; // Import the file system module
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from "helmet";
import morgan from "morgan";
import { exec } from "child_process"; // Import exec from child_process
import multer from 'multer';
import './jobScheduler.js'; // Import the job scheduler
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath function

// Import routes
import clientRoutes from "./routes/client.js";
import publicationRoutes from "./routes/publication.js";
import generalRoutes from "./routes/general.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import rejectEmailRoutes from "./routes/rejectionEmail.js";
import emailRoutes from "./routes/emailRoutes.js";

// Import data models
import User from "./models/User.js";
import Comment from "./models/User.js";
import Publication from "./models/Publication.js";
import Registration from "./models/Registration.js";

// Import data to inject into the database
import { dataPublication, dataUser , frenchPublication , arabicPublication ,algerianPublication ,governmentProjects ,RegistrationData} from "./data/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url); // Get current file path
const __dirname = path.dirname(__filename); // Get directory name from file path

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
app.use("/emails",emailRoutes);

// Root route
app.get("/", (request, response) => {
  response.status(200).send("WELCOME TO EGOVHUB");
});

// Route for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
app.post("/upload", upload.array('files[]'), (req, res) => {
  const firstFileName = req.files.length > 0 ? req.files[0].originalname : null;
  res.status(200).json({firstFileName });
});

// NLP ENDPOINT
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

// MONGODB SETUP
const communes = ["El Harrach", "Bologhine", "Casbah"];

async function updateUsers() {
  try {
    const users = await User.find({ commune: { $exists: false } });
    for (const user of users) {
      const randomCommune = communes[Math.floor(Math.random() * communes.length)];
      user.commune = randomCommune;
      await user.save();
    }
    console.log(`Updated ${users.length} users with random commune values.`);
  } catch (error) {
    console.error('Error updating users:', error);
  }
}

// Define the port
const PORT = process.env.PORT || 9000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("App connected to DATABASE");

    // HTTPS options: load SSL certificates
    const httpsOptions = {
      key: fs.readFileSync(path.resolve(__dirname, './cert/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './cert/cert.pem'))
    };

    // Create HTTPS server
    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`App is listening securely on port ${PORT}`);
    });

    // Update users (if needed)
    // updateUsers();
  })
  .catch((error) => {
    console.log(error);
  });
