import axios from "axios";
// import { Course } from "../../../course-service/src/models/course.js";
import Institute from "../models/index.js";
import { errorResponse, generateUUID, successResponse, validateCoordinates } from "../utils/index.js";
import dotenv from "dotenv"
dotenv.config()
import Branch from "../models/branchSchema.js";
import { ProfileUpdate } from "../utils/apiHelper.js";
import { logActivity } from "../utils/ActivitylogHelper.js";


export const createInstitute = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;

    const uuid = generateUUID();

    if (data.location?.coordinates) {
      await validateCoordinates(data.location.coordinates);
    }


    const institute = new Institute({ uuid, ...data, userId: user?._id, contactInfo: { ...data?.contactInfo, phone: user?.phoneNumber } });
    await institute.save();

    const mainBranch = new Branch({
      instituteId: institute._id,
      branchCode: "MAIN",
      name: "Main Branch",
      description: "This is the main branch of the institute",

      contactInfo: {
        email: institute.contactInfo?.email,
        phone: institute.contactInfo?.phone,
        address: institute.contactInfo?.address,
      },

      location: data?.location,

      settings: { allowBookings: true, allowOnsitePayments: true },
      statistics: { totalStudents: 0, totalCourses: 0 },
    });

    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Created Institutes",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Created Institutes successfully`,
    });

    await mainBranch.save();

    await ProfileUpdate(user?._id)

    return successResponse(res, "Institute and main branch created successfully", {
      institute,
      mainBranch,
    });

  } catch (error) {
    console.error("Error creating institute:", error);
    return errorResponse(res, error.message || "Failed to create institute");
  }
};

export const getNearbyInstitutes = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required.",
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers.",
      });
    }
    const distanceInMeters = maxDistance
      ? parseFloat(maxDistance)
      : 5000;

    if (isNaN(distanceInMeters)) {
      return res.status(400).json({
        success: false,
        message: "maxDistance must be a valid number.",
      });
    }

    const institutes = await Institute.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lon, lat] },
          distanceField: "distance",
          spherical: true,
          maxDistance: distanceInMeters,
          query: { isdeleted: false, isActive: true },
        },
      },
      {
        $project: {
          uuid: 1,
          name: 1,
          description: 1,
          logo: 1,
          location: 1,
          "contactInfo.address": 1,
          distance: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: institutes.length
        ? "Nearby institutes fetched successfully."
        : "No nearby institutes found.",
      data: institutes,
    });
  } catch (error) {
    console.error("Error fetching nearby institutes:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching nearby institutes.",
      error: error.message,
    });
  }
};



export const updateInstitute = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = req.user;

    const institute = await Institute.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );


    if (!institute) return errorResponse(res, "Institute not found", 404);
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Institute Updated",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Institute Updated successfully`,
    });

    return successResponse(res, "Institute updated successfully", institute);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getInstitutes = async (req, res) => {
  try {

    const {type} = req.query
    let institutes;
    if (type === 'all') {
      institutes = await Institute.find({ isdeleted: false});
    }else{
      institutes = await Institute.find({ isdeleted: false , status:'pending' });
    }

    return successResponse(res, "Institutes fetched successfully", institutes);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getInstitutesByUserId = async (req, res) => {
  try {
    const { id } = req.params
    const institutes = await Institute.findOne({ userId: id }).select("uuid _id name logo")

    return successResponse(res, "Institutes fetched successfully", institutes);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
export const getInstitutesBytoken = async (req, res) => {
  try {
    const { id } = req.user._id
    const institutes = await Institute.findOne({ userId: id })

    return successResponse(res, "Institutes fetched successfully", institutes);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getInstituteForCourse = async (req, res) => {
  try {
    const { id } = req.params
    const institutes = await Institute.findOne({ _id: id }).select("uuid _id name logo")

    return successResponse(res, "Institutes fetched successfully", institutes);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};


export const getByIdInstitutes = async (req, res) => {
  try {
    const { id } = req.params
    const institutes = await Institute.findById(id);
    if (!institutes) {
      return res.status(404).json({ message: "institute not found" })
    }
    return successResponse(res, "Institute fetched successfully", institutes);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
export const deleteinstitutebyid = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid Institute ID format" });
    }
    const deletedinstitute = await Institute.findByIdAndDelete(id)
    if (!deletedinstitute) {
      return res.status(404).json({ message: "Institute profile not found" })
    }
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Deleted",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Deleted successfully`,
    });


    res.status(200).json({ message: "deleted Institute", deletedinstitute })

  } catch (error) {
    res.status(500).json({ message: "error" })
  }
}

const student = async (url) => {
  try {
    const response = await axios.get(url)
    return response.data;

  } catch (error) {

  }
}
const fetchStudents = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data; // actual student array
  } catch (error) {
    return [];
  }
};

export const getInstitutesStudents = async (req, res) => {
  try {
    const { id } = req.params;

    // check if institute exists
    const institute = await Institute.findById(id);
    if (!institute) return errorResponse(res, "Institute not found", 400);

    // fetch all students
    const allStudents = await fetchStudents(process.env.student)

    // filter by institute
    const instituteStudents = allStudents.filter(student => student.instituteId === id);

    return successResponse(res, "Students fetched successfully", {
      institute: institute.name,
      totalStudents: instituteStudents.length,
      students: instituteStudents,
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};
const course = async (url) => {
  try {
    const response = await axios.get(url)
    return response;
  } catch (error) {

  }
}
export const getInstituteCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await Institute.findById(id);
    if (!institute) return errorResponse(res, "Institute not found", 404);
    let courses = await course(`${process.env.course_service + process.env.coursebymerchat + institute._id}`);
    if (!Array.isArray(courses)) courses = [];

    return successResponse(res, "Courses fetched successfully", {
      institute: institute.name,
      totalCourses: courses.length,
      courses,
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const searchInstitutes = async (req, res) => {
  try {
    const { name, status, city, state, country } = req.query;

    // Build filter object dynamically
    const filter = {};

    if (name) filter.name = { $regex: name, $options: "i" }; // case-insensitive
    if (status) filter.isActive = status.toLowerCase() === "active";
    if (city) filter["contactInfo.address.city"] = { $regex: city, $options: "i" };
    if (state) filter["contactInfo.address.state"] = { $regex: state, $options: "i" };
    if (country) filter["contactInfo.address.country"] = { $regex: country, $options: "i" };

    // Make sure at least one filter is provided
    if (Object.keys(filter).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one search parameter."
      });
    }

    const institutes = await Institute.find(filter).sort({ createdAt: -1 });

    if (!institutes || institutes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No institutes found matching the search criteria."
      });
    }

    return res.status(200).json({
      success: true,
      count: institutes.length,
      data: institutes
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while searching institutes.",
      error: error.message
    });
  }
};