import { Course } from "../../models/coursemodel.js";

// Get all reviews for a course
export const getCourseReviews = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course.reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};

// Add a review to a course
export const addCourseReview = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const { userId, name, rating, comment } = req.body;
    const review = { userId, name, rating, comment };

    course.reviews.push(review);
    await course.save(); 

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ message: "Error adding review", error: err.message });
  }
};
