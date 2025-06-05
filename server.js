require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const courseRoutes = require("./routes/course");
const Course = require("./models/course");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/courses", courseRoutes);

// Sync database and start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  console.log("PostgreSQL connected and synced");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
