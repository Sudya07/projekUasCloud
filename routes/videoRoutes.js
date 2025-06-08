const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/video');

// Setup multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Route upload video
router.post('/upload', upload.single('videoFile'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = 2; // misalnya guru userId = 2 (ganti sesuai sistem auth kamu)

    if (!req.file) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    const video = await Video.create({
      filename: req.file.filename,
      title,
      description,
      userId
    });

    res.status(201).json({ message: 'Video berhasil diupload', video });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal upload video', error: err.message });
  }
});

// Route list video
router.get('/list', async (req, res) => {
  try {
    const videos = await Video.findAll();
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data video' });
  }
});

// Route stream video dengan support range header
router.get('/stream/:filename', (req, res) => {
  const videoPath = path.join(__dirname, '../uploads', req.params.filename);
  fs.stat(videoPath, (err, stats) => {
    if (err) {
      console.error(err);
      return res.status(404).json({ message: 'Video tidak ditemukan' });
    }

    const range = req.headers.range;
    if (!range) {
      // Kirim full file kalau tidak ada range
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(videoPath).pipe(res);
    } else {
      // Parse range
      const positions = range.replace(/bytes=/, "").split("-");
      const start = parseInt(positions[0], 10);
      const total = stats.size;
      const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      const chunksize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${total}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      });

      const stream = fs.createReadStream(videoPath, { start, end });
      stream.pipe(res);
    }
  });
});

module.exports = router;
