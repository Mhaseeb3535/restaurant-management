import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadDir = path.resolve(process.cwd(), "public/uploads/screenshots");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(uploadDir, { recursive: true }, (error) => {
      cb(error, uploadDir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${path.basename(file.originalname)}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// @route   POST /api/upload
// @desc    Upload a file
// @access  Private
router.post("/", (req, res, next) => {
  if (process.env.VERCEL === "1") {
    res.status(503).json({
      error: "File uploads require persistent object storage on Vercel.",
    });
    return;
  }
  next();
}, upload.single("file"), (req, res) => {
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
