const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/database'); // koneksi database Sequelize
const authRoutes = require('./routes/authRoutes');  // jika ada
const videoRoutes = require('./routes/videoRoutes'); // routes video

// Buat folder uploads jika belum ada
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Folder uploads dibuat');
}

// Middleware untuk parsing JSON dan form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve folder uploads agar file bisa diakses secara langsung via URL
app.use('/uploads', express.static(uploadDir));

// Serve file statis dari folder public (misal: index.html, login.html)
app.use(express.static(path.join(__dirname, 'public')));

// Gunakan routes
app.use('/api/auth', authRoutes);       // jika ada routes auth
app.use('/api/videos', videoRoutes);    // routes untuk video upload dan lainnya

// Middleware error handling global
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Sinkronisasi database dan start server
sequelize.sync({ alter: true }) // sinkronisasi model dan DB
  .then(() => {
    console.log('Database synced');
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
