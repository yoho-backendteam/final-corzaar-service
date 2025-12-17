import Branch from "../models/branchSchema.js";
import mongoose from "mongoose";
import {
  createBranchValidation,
  updateBranchValidation,
  uuidValidation,
  instituteIdValidation
} from "../validation/branchValidation.js";
import Institute from "../models/index.js";
import { logActivity } from "../utils/ActivitylogHelper.js";
// import { getData } from "../utils/apiHelper.js";

export const createBranch = async (req, res) => {
  try {
    const user = req.user
    const { error } = createBranchValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const institute = await Institute.findOne({ userId: user?._id })
    const instituteId = institute?._id


    const {
      branchCode,
      name,
      description,
      contactInfo,
      location,
      images,
      statistics,
      settings,
      status,
      establishedDate,
      lastMaintenanceDate
    } = req.body;


    const existingBranch = await Branch.findOne({
      instituteId,
      branchCode,
      isDeleted: false
    });

    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: "Branch code already exists for this institute"
      });
    }

    const branch = new Branch({
      instituteId,
      branchCode,
      name,
      description,
      contactInfo,
      location,
      images: images || {},
      statistics: statistics || {},
      settings: settings || {},
      status,
      establishedDate,
      lastMaintenanceDate
    });

    const savedBranch = await branch.save();
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Branch",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Branch Created successfully`,
    });


    await savedBranch.populate('instituteId', 'name uuid');

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: savedBranch
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error creating branch",
      error: error.message
    });
  }
};

export const getBranchesByInstitute = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const { error } = instituteIdValidation.validate({ instituteId });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid institute ID"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(instituteId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid institute ID format"
      });
    }

    const query = {
      instituteId,
      isDeleted: false
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    const branches = await Branch.find(query)
      .populate('instituteId', 'name uuid')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Branch.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Branches retrieved successfully",
      data: branches,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBranches: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error retrieving branches",
      error: error.message
    });
  }
};


export const getBranchByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Validate UUID
    const { error } = uuidValidation.validate({ uuid });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch UUID"
      });
    }

    const branch = await Branch.findOne({
      uuid,
      isDeleted: false
    }).populate('instituteId', 'name uuid logo contactInfo');

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Branch retrieved successfully",
      data: branch
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error retrieving branch",
      error: error.message
    });
  }
};

export const updateBranchByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;
    const updateData = req.body;
    const user = req.user;
    console.log('reached update', updateData)

    // Validate UUID
    const uuidError = uuidValidation.validate({ uuid }).error;
    if (uuidError) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch UUID"
      });
    }

    // Validate update data
    // const { error } = updateBranchValidation.validate(updateData);
    // if (error) {
    //   return res.status(400).json({
    //     success: false,
    //     message: error.details[0].message
    //   });
    // }

    const existingBranch = await Branch.findOne({
      uuid,
      isDeleted: false
    });

    if (!existingBranch) {
      return res.status(404).json({
        success: false,
        message: `Branch with UUID '${uuid}' not found`
      });
    }

    if (updateData.branchCode && updateData.branchCode !== existingBranch.branchCode) {
      const duplicateBranch = await Branch.findOne({
        instituteId: existingBranch.instituteId,
        branchCode: updateData.branchCode,
        isDeleted: false,
        uuid: { $ne: uuid }
      });

      if (duplicateBranch) {
        return res.status(400).json({
          success: false,
          message: "Branch code already exists for this institute"
        });
      }
    }

    const updatedBranch = await Branch.findOneAndUpdate(
      { uuid, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('instituteId', 'name uuid');
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Branch",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Branch updated successfully`,
    });

    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: updatedBranch
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error updating branch",
      error: error.message
    });
  }
};


export const deleteBranchByUUID = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Validate UUID
    const { error } = uuidValidation.validate({ uuid });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch UUID"
      });
    }

    const branch = await Branch.findOneAndUpdate(
      { uuid, isDeleted: false },
      {
        isDeleted: true,
        isActive: false,
        status: "closed"
      },
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found"
      });
    }
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Branch",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Branch Deleted successfully`,
    });

    res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
      data: {
        uuid: branch.uuid,
        branchId: branch.branchId,
        name: branch.name,
        deletedAt: new Date()
      }
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error deleting branch",
      error: error.message
    });
  }
};


export const getAllBranches = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      instituteId,
      status,
      search
    } = req.query;

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

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { branchCode: { $regex: search, $options: 'i' } },
        { branchId: { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    const branches = await Branch.find(query)
      .populate('instituteId', 'name uuid')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Branch.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "All branches retrieved successfully",
      data: branches,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBranches: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error retrieving branches",
      error: error.message
    });
  }
};
export const getAllBranchesByInstitute = async (req, res) => {
  try {
    const user = req.user
    const {
      page = 1,
      limit = 10,
      status,
      search
    } = req.query;


    const institute = await Institute.findOne({ userId: user?._id })

    const query = { instituteId: institute?._id, isDeleted: false };
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { branchCode: { $regex: search, $options: 'i' } },
        { 'contactInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    const branches = await Branch.find(query)
      .populate('instituteId', 'name uuid')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // const course = await getData(`${process.env.course_url}/api/courses/getCourseBymerchant`)
    // console.log("course",course)

    const total = await Branch.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "All branches retrieved successfully",
      data: branches,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBranches: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error retrieving branches",
      error: error.message
    });
  }
};

