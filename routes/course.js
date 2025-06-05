const express = require("express");
const router = express.Router();
const Course = require("../models/course");

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create course
router.post("/", async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
