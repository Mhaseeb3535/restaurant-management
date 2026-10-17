import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Ensure the uploads directory exists
const uploadDir = "public/uploads/screenshots";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// @route   POST /api/upload
// @desc    Upload a file
// @access  Private
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Construct the URL of the uploaded file
  const fileUrl = `/uploads/screenshots/${req.file.filename}`;

  res.json({
    message: "File uploaded successfully",
    url: fileUrl,
  });
});

export default router;
