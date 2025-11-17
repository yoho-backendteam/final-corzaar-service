import { Course } from "../models/coursemodel.js";
import { GetInstituteByUserId } from "../utils/axiosHelpers.js";
import { createCourseSchema, updateCourseSchema } from "../validations/courseValidation.js";


//  Create Course
export const createCourse = async (req, res) => {
  const user = req.user;

 
  const { data } = await GetInstituteByUserId(user?._id);

  if (!data) {
    return res.status(404).json({ status: false, message: "institute not found your id" });
  }

  const { error, value } = createCourseSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map((d) => ({ message: d.message, path: d.path })),
    });
  }

  try {
    const course = new Course({ ...value, instituteId: data._id });
    await course.save();

    res.status(201).json({
      message: "Course created successfully",
      data: course
    });
  } catch (err) {
    console.error("Create Course Error:", err);
    res.status(500).json({ message: "Server error creating course", error: err.message });
  }
};



//  Get All Courses 
export const getCourses = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    const filter = q
      ? {
          $or: [
            { title: new RegExp(q, "i") },
            { "category.primary": new RegExp(q, "i") },
            { "category.tags": new RegExp(q, "i") },
          ],
        }
      : {};

    const total = await Course.countDocuments(filter);

    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      message: "Courses retrieved successfully",
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      limit: parseInt(limit),
      data: courses,
    });
  } catch (error) {
    console.error("Get Courses Error:", error);
    res.status(500).json({ message: "Server error fetching courses" });
  }
};

export const getallcorses = async (req, res) => {
  try {
    const courses = await Course.find({is_active:true});
    res.json(courses);
  } catch (error) {
    console.error("Get All Courses Error:", error);
    res.status(500).json({ message: "Server error fetching all courses" });
  }
};

// Get Single Course
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ 
      message: "Course retrieved successfully", 
      data: course 
    });
  } catch (error) {
    console.error("Get Course Error:", error);
    res.status(500).json({ message: "Server error fetching course" });
  }
};

export const getCourseByInstitute = async (req, res) => {
  try {
    const user = req.user
    const {data} = await GetInstituteByUserId(user?._id)
    const course = await Course.find({instituteId:data?._id});
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    console.error("Get Course Error:", error);
    res.status(500).json({ message: "Server error fetching course" });
  }
};

export const getCourseByBranch = async (req, res) => {
  try {
    const course = await Course.findById({branchId:req.params.id});
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    console.error("Get Course Error:", error);
    res.status(500).json({ message: "Server error fetching course" });
  }
};


//  Update Course
export const updateCourse = async (req, res) => {
  try {
    const { error, value } = updateCourseSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details.map((d) => ({ message: d.message, path: d.path })),
      });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, value, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ 
      message: "Course updated successfully", 
      data: updated 
    });
  } catch (error) {
    console.error("Update Course Error:", error);
    res.status(500).json({ message: "Server error updating course", error: error.message });
  }
};


//  Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete Course Error:", error);
    res.status(500).json({ message: "Server error deleting course" });
  }
};


//  Search Courses 
export const searchCourses = async (req, res) => {
  try {
    const query = req.query.query || "";
    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { "category.primary": { $regex: query, $options: "i" } },
        { "category.tags": { $regex: query, $options: "i" } },
      ],
    });
    res.json({ 
      message: "Courses search completed successfully", 
      data: courses 
    });
  } catch (err) {
    console.error("Search Courses Error:", err);
    res.status(500).json({ message: "Server error searching courses", error: err.message });
  }
};


//  Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Course.find();
    res.json({ 
      message: "Categories retrieved successfully", 
      data: categories 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err.message });
  }
};


export const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).limit(5);
    res.json({ 
      message: "Featured courses retrieved successfully", 
      data: courses 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching featured courses", error: err.message });
  }
};


export const getTrendingCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ "reviews.length": -1 }).limit(5);
    res.json({ 
      message: "Trending courses retrieved successfully", 
      data: courses 
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching trending courses", error: err.message });
  }
};