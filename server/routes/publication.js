import express from "express";
import { getAllPublications, getPublicationById, createPublication, updatePublication, deletePublication } from "../controller/publication.js";
import multer from 'multer';
import protect from "../middleware/authMiddleware.js";

const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
  

const upload = multer({storage});


// Define routes with prefix '/publications'
router.get("/publications", getAllPublications);
router.get("/publications/:id",protect, getPublicationById);
router.post("/publications",protect,upload.single('photos'), createPublication);
router.put("/publications/:id", updatePublication);
router.delete("/publications/:id",protect, deletePublication);

export default router;
