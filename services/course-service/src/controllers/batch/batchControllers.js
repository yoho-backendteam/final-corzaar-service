import { Batch } from "../../models/batch/batchSchema.js"
import { Course } from "../../models/coursemodel.js";
import { GetInstituteByUserId } from "../../utils/axiosHelpers.js";
import { createBatchValidation, updateBatchContentValidation, updateBatchSettingsValidation, updateBatchValidation } from "../../validations/batchValidation.js";

// create batch
export const createBatch = async (req, res) => {
    const user = req.user
    const { courseid } = req.params
    console.log(courseid, "coruse");

    try {
        const { error, value } = createBatchValidation.validate(req.body);

        
        if (error) {
            return res.status(400).json({
                status: false,
                message: error.details[0].message
            });
        }
        
        const { data } = await GetInstituteByUserId(user?._id)
        console.log(data,"inst id")

        const checkId = await Course.findById(courseid)
        if (!checkId) return res.status(400).json({ message: "course not found" })
        const create = new Batch({...value,merchantId:data?._id});
        await create.save()
        res.status(201).json({
            status: true,
            message: "Batch created successfully",
            data: create
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

//get All batch
export const getAllBatch = async (req, res) => {
    const { merchantId } = req.params
    const { page, limit } = req.query
    try {
        const pages = parseInt(page) || 1;
        const limits = parseInt(limit) || 10;
        const skip = (pages - 1) * limits;
        const checkId = await Batch.find({ merchantId }).skip(skip).limit(limits).populate([{ path: "courseId", model: "Course" }])

        const totalBatch = await Batch.countDocuments();

        res.status(201).json({
            status: true,
            message: "All Batch fetched successfully",
            currentPage: page,
            totalPages: Math.ceil(totalBatch / limits),
            data: checkId
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

//get batch by course
export const 
getBatchByCourse = async (req, res) => {
    const { courseId } = req.params
    const { page, limit } = req.query

    try {
        const pages = parseInt(page) || 1
        const limits = parseInt(limit) || 10
        const skip = (pages - 1) * limits

        const checkId = await Batch.find({ courseId: courseId }).skip(skip).limit(limits).populate([{ path: "courseId", model: "Course" }])

        const totalBatch = await Batch.countDocuments();

        res.status(201).json({
            status: true,
            message: "Batch fetched successfully",
            currentPage: pages,
            totalPages: Math.ceil(totalBatch / limits),
            data: checkId
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}
export const getBatchByStudent = async (req, res) => {
    const { studentId } = req.params
    const { page, limit } = req.query
    // console.log(courseId,"coruse");

    try {
        const pages = parseInt(page) || 1
        const limits = parseInt(limit) || 10
        const skip = (pages - 1) * limits

        const checkId = await Batch.find({ students: { $in: studentId } })
        // console.log("check", checkId)

        const totalBatch = await Batch.countDocuments();

        res.status(201).json({
            status: true,
            message: "Batch fetched successfully",
            currentPage: pages,
            totalPages: Math.ceil(totalBatch / limits),
            data: checkId
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// get batch by course with batch id
export const getBatchByBatchId = async (req, res) => {
    const { courseid, batchid } = req.params

    try {
        const checkId = await Batch.findOne({ courseId: courseid, _id: batchid }).populate([{ path: "courseId", model: "Course" }])
        // console.log("check", checkId)
        res.status(201).json({
            status: true,
            message: "Batch fetched successfully",
            data: checkId
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// update batch by course with batch id
export const updateBatchByBatchId = async (req, res) => {
    const { courseid, batchid } = req.params

    try {
        const { error, value } = updateBatchValidation.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: false,
                message: error.details[0].message
            });
        }
        const checkId = await Batch.findOneAndUpdate({ courseId: courseid, _id: batchid }, value, { new: true }).populate([{ path: "courseId", model: "Course" }])
        // console.log("check", checkId)
        res.status(201).json({
            status: true,
            message: "Batch Updated successfully",
            data: checkId
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// update batch by course with batch id
export const deleteBatchByBatchId = async (req, res) => {
    const { courseid, batchid } = req.params

    try {
        const checkId = await Batch.findOneAndDelete({ courseId: courseid, _id: batchid }, req.body, { new: true }).populate([{ path: "courseId", model: "Course" }])
        res.status(201).json({
            status: true,
            message: "Batch Deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// get batch by search
export const getBatchBySearch = async (req, res) => {
    const { keyword } = req.query
    try {
        const query = keyword
            ? {
                $or: [
                    { batchName: { $regex: keyword, $options: "i" } },
                    { batchCode: { $regex: keyword, $options: "i" } },
                ]
            } : {};

        // console.log("quer", query)

        const filterBatch = await Batch.find(query).populate([{ path: "courseId", model: "Course" }]).sort({ createdAt: -1 });
        res.status(201).json({
            status: true,
            message: "Batch search results fetched successfully",
            data: filterBatch
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

// get content by batchId
export const getContentByBatchId = async (req, res) => {
    const { courseid, batchid } = req.params

    try {
        const checkId = await Batch.findOne({ courseId: courseid, _id: batchid }).populate([{ path: "courseId", model: "Course" }])
        // console.log("check", checkId)
        res.status(201).json({
            status: true,
            message: "Content fetched successfully",
            data: checkId.courseId.content
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

// update content by batch Id
export const updateContentByBatchId = async (req, res) => {
    const { courseid, batchid } = req.params;

    try {
        const { error, value } = updateBatchContentValidation.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: false,
                message: error.details[0].message
            });
        }

        const { content } = value;

        const batch = await Batch.findOne({ courseId: courseid, _id: batchid });

        if (!batch) {
            return res.status(404).json({ status: false, message: "Batch not found" });
        }

        const updateData = {};
        for (const key in content) {
            updateData[`content.${key}`] = content[key];
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseid,
            { $set: updateData },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ status: false, message: "Course not found" });
        }

        res.status(200).json({
            status: true,
            message: "Content updated successfully",
            data: updatedCourse.content,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

//  update batch setting
export const updateBatchSetting = async (req, res) => {
    const { courseid, batchid } = req.params;

    try {
        const { error, value } = updateBatchSettingsValidation.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: false,
                message: error.details[0].message
            });
        }

        const { settings } = value;

        const checkId = await Batch.findOneAndUpdate(
            { courseId: courseid, _id: batchid },
            { $set: { settings: settings } },
            { new: true }
        );

        if (!checkId) {
            return res.status(404).json({
                status: false,
                message: "Batch not found",
            });
        }

        res.status(200).json({
            status: true,
            message: "Batch settings updated successfully",
            data: checkId.settings,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
// get Batch setting
export const getBatchSetting = async (req, res) => {
    const { courseid, batchid } = req.params

    try {
        const checkId = await Batch.findOne({ courseId: courseid, _id: batchid })
        // console.log("check", checkId)
        res.status(201).json({
            status: true,
            message: "Batch Setting fetched successfully",
            data: checkId.settings
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

export const getallbatch = async (req, res) => {
    try {
        const batchall = await Batch.find({ isdeleted: false })
        res.status(201).json({
            status: true,
            message: "get all batch successfully",
            data: batchall
        })
    }
    catch {
        res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })

    }
}

export const getBatchByInstitute = async (req, res) => {
  try {
     const user = req.user 
     const { data } = await GetInstituteByUserId(user?._id)
     console.log("data",data,"eeee")

     const batches = await Batch.find({merchantId:data?._id,isdeleted:false})

     res.status(200).json({
            status: true,
            message: "get all batch successfully",
            data: batches
    })
  } catch (error) {
     res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        })
  }
};
