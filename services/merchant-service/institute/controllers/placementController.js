import Placement from "../models/placementSchema.js";
import mongoose from "mongoose";
import {
  createPlacementValidation,
  updatePlacementValidation,
  uuidValidation,
  instituteIdValidation,
  studentIdValidation,
  updateInterviewRoundValidation,
  updateVerificationValidation,
  addDocumentValidation,
  statusFilterValidation
} from "../validation/placementValidation.js";
import Institute from "../models/index.js";

export const createPlacement = async (req, res) => {
  try {

    const user = req.user

    const { error } = createPlacementValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const institute = await Institute.findOne({ userId: user?._id })
    const instituteId = institute?._id

    const {
      placementId,
      student,
      company,
      jobTitle,
      jobDescription,
      jobType,
      department,
      salary,
      applicationDate,
      interviewDate,
      offerDate,
      joiningDate,
      interviewProcess,
      placementStatus,
      verification,
      skillsUsed,
      isOnCampus,
      referral
    } = req.body;

    // Check if placementId already exists
    const existingPlacement = await Placement.findOne({
      placementId,
      isDeleted: false
    });

    if (existingPlacement) {
      return res.status(400).json({
        success: false,
        message: "Placement ID already exists"
      });
    }

    const placement = new Placement({
      instituteId,
      placementId,
      student,
      company,
      jobTitle,
      jobDescription,
      jobType,
      department,
      salary,
      applicationDate,
      interviewDate,
      offerDate,
      joiningDate,
      interviewProcess,
      placementStatus,
      verification,
      skillsUsed,
      isOnCampus,
      referral
    });

    const savedPlacement = await placement.save();
    await savedPlacement.populate('instituteId', 'name uuid');
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Placement",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Placement Created successfully`,
    });

    res.status(201).json({
      success: true,
      message: "Placement created successfully",
      data: savedPlacement
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error creating placement",
      error: error.message
    });
  }
};

export const getAllPlacements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      instituteId,
      studentId,
      companyName,
      placementStatus,
      jobType,
      fromDate,
      toDate,
      minSalary,
      maxSalary,
      sortBy = 'joiningDate',
      sortOrder = 'desc'
    } = req.query;

    // Build query object
    const query = { isDeleted: false };

    // Institute filter
    if (instituteId) {
      if (!mongoose.Types.ObjectId.isValid(instituteId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid institute ID"
        });
      }
      query.instituteId = instituteId;
    }

    // Student filter
    if (studentId) {
      query['student.studentId'] = studentId;
    }

    // Company filter
    if (companyName) {
      query['company.name'] = new RegExp(companyName, 'i');
    }

    // Status filter
    if (placementStatus && placementStatus !== 'all') {
      query.placementStatus = placementStatus;
    }

    // Job type filter
    if (jobType && jobType !== 'all') {
      query.jobType = jobType;
    }

    // Date range filter
    if (fromDate || toDate) {
      query.joiningDate = {};
      if (fromDate) query.joiningDate.$gte = new Date(fromDate);
      if (toDate) query.joiningDate.$lte = new Date(toDate);
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      query['salary.baseSalary'] = {};
      if (minSalary) query['salary.baseSalary'].$gte = parseInt(minSalary);
      if (maxSalary) query['salary.baseSalary'].$lte = parseInt(maxSalary);
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const placements = await Placement.find(query)
      .populate('instituteId', 'name uuid logo')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Placement.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "All placements retrieved successfully",
      data: placements,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPlacements: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        instituteId,
        studentId,
        companyName,
        placementStatus,
        jobType,
        fromDate,
        toDate,
        minSalary,
        maxSalary
      }
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error retrieving placements",
      error: error.message
    });
  }
};

export const getAllPlacementsC = async (req, res) => {
  try {
    const placements = await Placement.find({ isDeleted: false })
      .populate('instituteId', 'name uuid logo contactInfo')
    res.status(200).json({
      success: true,
      message: "All placements retrieved successfully",
      data: placements
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving placement",
      error: error.message
    });
  }

}

export const getPlacementByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const idError = uuidValidation.validate({ uuid }).error;
    if (idError) {
      return res.status(400).json({
        success: false,
        message: "Invalid placement UUID"
      });
    }

    const placement = await Placement.findOne({
      uuid,
      isDeleted: false
    }).populate('instituteId', 'name uuid logo contactInfo');

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Placement retrieved successfully",
      data: placement
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error retrieving placement",
      error: error.message
    });
  }
};


export const updatePlacementByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;
    const updateData = req.body;

    // Validate UUID
    const idError = uuidValidation.validate({ uuid }).error;
    if (idError) {
      return res.status(400).json({
        success: false,
        message: "Invalid placement UUID"
      });
    }

    // Validate update data
    const { error } = updatePlacementValidation.validate(updateData);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Find existing placement by UUID
    const existingPlacement = await Placement.findOne({
      uuid,
      isDeleted: false
    });

    // Check if placement exists
    if (!existingPlacement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found"
      });
    }

    const updatedPlacement = await Placement.findOneAndUpdate(
      { uuid, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('instituteId', 'name uuid');
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Placement",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Placement Updated successfully`,
    });


    res.status(200).json({
      success: true,
      message: "Placement updated successfully",
      data: updatedPlacement
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error updating placement",
      error: error.message
    });
  }
};


export const deletePlacementByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    const idError = uuidValidation.validate({ uuid }).error;
    if (idError) {
      return res.status(400).json({
        success: false,
        message: "Invalid placement UUID"
      });
    }

    const placement = await Placement.findOneAndUpdate(
      { uuid, isDeleted: false },
      {
        isDeleted: true,
        isActive: false
      },
      { new: true }
    );

    // Check if placement was found and updated
    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found or already deleted"
      });
    }
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Placement",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Placement Deleted successfully`,
    });


    res.status(200).json({
      success: true,
      message: "Placement deleted successfully",
      data: {
        uuid: placement.uuid,
        placementId: placement.placementId,
        studentName: placement.student.name,
        company: placement.company.name,
        deletedAt: new Date()
      }
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error deleting placement",
      error: error.message
    });
  }
};

export const getPlacementsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const idError = studentIdValidation.validate({ studentId }).error;
    if (idError) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID"
      });
    }

    const placements = await Placement.find({
      'student.studentId': studentId,
      isDeleted: false
    })
      .populate('instituteId', 'name uuid')
      .sort({ joiningDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Placement.countDocuments({
      'student.studentId': studentId,
      isDeleted: false
    });

    res.status(200).json({
      success: true,
      message: "Student placements retrieved successfully",
      data: placements,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPlacements: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error retrieving student placements",
      error: error.message
    });
  }
};

export const getPlacementById = async (req, res) => {
  try {
    const { placementId } = req.params;

    const placement = await Placement.findOne({
      placementId,
      isDeleted: false
    }).populate('instituteId', 'name uuid logo contactInfo');

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: "Placement not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Placement retrieved successfully",
      data: placement
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error retrieving placement",
      error: error.message
    });
  }
};