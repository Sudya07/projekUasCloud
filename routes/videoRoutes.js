const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadVideo } = require("../controllers/videoController");

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Endpoint upload video
router.post("/upload", upload.single("video"), uploadVideo);

module.exports = router;
