import mongoose from 'mongoose';
import student_management from '../../models/studentmanagment/student_management.js';
import { studentJoiSchema, studentUpdateJoiSchema } from '../../validations/studentmanagement/student_management.js';
import { UpdateProfileFlagAxios } from '../../utils/cart/index.js';



export const createStudent = async (req, res) => {
  try {
    
    const user = req.user
    const { error, value } = studentJoiSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(d => d.message) 
      });
    }

    
    const newStudent = new student_management({
      _id: new mongoose.Types.ObjectId(),
      userId:user?._id,
      ...value,
      fullName:value?.personalInfo?.fullName
    });

  
    const savedStudent = await newStudent.save();

    UpdateProfileFlagAxios(user?._id)

    res.status(201).json({
      success: true,
      message: 'Student created successfully!',
      // data: savedStudent
    });

  } catch (error) {
    console.error('Error creating student:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while creating student.',
      error: error.message
    });
  }
};



export const getAllStudents = async (req, res) => {
  try {
    const students = await student_management.find(); 

    if (!students || students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No students found.'
      });
    }

    res.status(200).json({
      message: "fetched All student successfully",
      success: true,
      count: students.length,
      data: students
    });

  } catch (error) {
    console.error('Error retrieving students:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving students.',
      error: error.message
    });
  }
};




export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await student_management.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Error retrieving student:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving student.',
      error: error.message
    });
  }
};



export const updateStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { error, value } = studentUpdateJoiSchema.validate(updateData, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map((d) => d.message),
      });
    }

 
    const updatedStudent = await student_management.findByIdAndUpdate(
      id,
      { $set: value },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

   
    res.status(200).json({
      success: true,
      message: 'Student updated successfully!',
      data: updatedStudent,
    });

  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating student.',
      error: error.message,
    });
  }
};



export const deleteStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent = await student_management.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully!',
      data: deletedStudent
    });

  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting student.',
      error: error.message
    });
  }
};



export const getAcademicInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await student_management.findById(id).select('academicInfo');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: student.academicInfo
    });

  } catch (error) {
    console.error('Error retrieving academic info:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving academic info.',
      error: error.message
    });
  }
};




export const searchStudents = async (req, res) => {
  try {
    const { studentId, rollNumber, status, semester, name } = req.query;

    
    const filter = {};

    if (studentId) filter.studentId = { $regex: studentId, $options: 'i' };
    if (rollNumber) filter.rollNumber = { $regex: rollNumber, $options: 'i' };
    if (status) filter.status = status;
    if (semester) filter.semester = Number(semester);
    if (name) filter['personalInfo.emergencyContact.name'] = { $regex: name, $options: 'i' };

  
    if (Object.keys(filter).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one search parameter.'
      });
    }


    const students = await student_management.find(filter).sort({ createdAt: -1 });

    if (!students || students.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No students found matching the search criteria.'
      });
    }

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching students.',
      error: error.message
    });
  }
};

