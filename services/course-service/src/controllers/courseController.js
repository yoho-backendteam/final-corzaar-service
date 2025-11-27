import { Course } from "../models/coursemodel.js";
import { GetInstituteBId, GetInstituteByUserId } from "../utils/axiosHelpers.js";
import { createCourseSchema, updateCourseSchema } from "../validations/courseValidation.js";


//  Create Course
export const createCourse = async (req, res) => {
  const user = req.user

  const { data } = await GetInstituteByUserId(user?._id)

  if (!data) {
    return res.status(404).json({ status: false, message: "institute not found your id" })
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
    console.log("course",course);
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
    const courses = await Course.find({ is_active: true });
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
    const { data } = await GetInstituteByUserId(user?._id)
    const course = await Course.find({ instituteId: data?._id });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    console.error("Get Course Error:", error);
    res.status(500).json({ message: "Server error fetching course" });
  }
};

export const getCourseByBranch = async (req, res) => {
  try {
    const course = await Course.findById({ branchId: req.params.id });
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


export const filterCourses = async (req, res) => {
  try {
    const {
      categories,
      levels,
      minRating,
      minPrice,
      maxPrice,
      modes,
      locationRadius,
      latitude,
      longitude,
      page = 1,
      limit = 10,
    } = req.query;
    const filter = { is_active: true };
    if (categories) {
      const categoryArray = categories.split(',').map(c => c.trim());
      filter.$or = [
        { "category.primary": { $in: categoryArray.map(c => new RegExp(c, "i")) } },
        { "category.secondary": { $in: categoryArray.map(c => new RegExp(c, "i")) } },
        { "category.tags": { $in: categoryArray.map(c => new RegExp(c, "i")) } }
      ];
    }
    if (levels) {
      const levelArray = levels.split(',').map(l => l.trim().toLowerCase());
      filter.level = { $in: levelArray };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter["pricing.price"] = {};
      if (minPrice !== undefined) {
        filter["pricing.price"].$gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        filter["pricing.price"].$lte = parseFloat(maxPrice);
      }
    }
    if (modes) {
      const modeArray = modes.split(',').map(m => m.trim().toLowerCase());
      filter.mode = { $in: modeArray };
    }
    let coursesQuery = Course.find(filter)
      .populate('branchId')
      .sort({ createdAt: -1 });
    let courses = await coursesQuery;
    if (minRating) {
      const minRatingFloat = parseFloat(minRating);
      courses = courses.filter(course => {
        if (!course.reviews || course.reviews.length === 0) return false;

        const avgRating = course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length;
        return avgRating >= minRatingFloat;
      });
    }
    if (locationRadius && latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);
      const radiusInKm = parseFloat(locationRadius);

      courses = courses.filter(course => {
        if (!course.branchId || !course.branchId.location || !course.branchId.location.coordinates) {
          return false;
        }

        const [branchLng, branchLat] = course.branchId.location.coordinates;
        const distance = calculateDistance(userLat, userLng, branchLat, branchLng);
        return distance <= radiusInKm;
      });
    }
    const total = courses.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCourses = courses.slice(startIndex, endIndex);

    res.json({
      message: "Filtered courses retrieved successfully",
      total: total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      limit: parseInt(limit),
      data: paginatedCourses,
      appliedFilters: {
        categories: categories?.split(',') || [],
        levels: levels?.split(',') || [],
        minRating: minRating || null,
        priceRange: {
          min: minPrice ? parseFloat(minPrice) : 0,
          max: maxPrice ? parseFloat(maxPrice) : null
        },
        modes: modes?.split(',') || [],
        locationRadius: locationRadius || null
      }
    });
  } catch (error) {
    console.error("Filter Courses Error:", error);
    res.status(500).json({
      message: "Server error filtering courses",
      error: error.message
    });
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


export const GetCartCourseData = async(req,res)=>{
  try {
    const {item} = req.body

    let finaldata = [];

    for (let index of item) {
       let course = await Course.findOne({_id:index}).select("_id uuid title shortDescription instituteId branchId duration pricing")

      if (course) {
  
        const {data} = await GetInstituteBId(course?.instituteId)

        let obj ={...course._doc,instituteId:data}  
  
        finaldata.push(obj)
      }
    }

    res.status(200).json({status:true,message:"cart course fetched",data:finaldata})
  } catch (error) {
    res.status(500).json({stauts:false,message:"internal server error"})
  }
}