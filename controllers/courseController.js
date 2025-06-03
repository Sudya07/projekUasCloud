const Course = require("../models/courseModel");

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addCourse = async (req, res) => {
  const { title, description, videoUrl } = req.body;
  try {
    const course = new Course({ title, description, videoUrl });
    await course.save();
    res.status(201).json({ message: "Course added", course });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
