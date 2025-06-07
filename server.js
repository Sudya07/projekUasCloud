const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const sequelize = require('./config/database');
const User = require('./models/user');
const Video = require('./models/video');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Server running on port 3000'));
});

const videoRoutes = require("./routes/videoRoutes");
const fs = require("fs");

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

app.use("/api/videos", videoRoutes);
