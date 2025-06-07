const Video = require("../models/video");

const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ error: "File video tidak ditemukan." });
    }

    const newVideo = await Video.create({
      title,
      description,
      filename: videoFile.filename,
    });

    res.json({ message: "Video berhasil diunggah.", video: newVideo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat upload video." });
  }
};

module.exports = {
  uploadVideo,
};
