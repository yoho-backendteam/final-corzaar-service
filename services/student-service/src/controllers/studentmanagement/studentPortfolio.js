import student_management from '../../models/studentmanagment/student_management.js';
import axios from "axios";

export const getStudentPortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    // 🔹 Fetch student
    const student = await student_management.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    console.log("student instituteId:", student?.instituteId);

    // 🔹 Fetch institute
    let institute = null;
    try {
      const instituteRes = await axios.get(
        `http://localhost:3002/merchant/getbyid/${student.instituteId}`
      );
      institute = instituteRes.data?.data || null;
    } catch (err) {
      console.error("Error fetching institute:", err.message);
    }

    // 🔹 Fetch batches
    let studentBatches = [];
    try {
      const batchRes = await axios.get(`http://localhost:3001/api/v1/student/${id}/batch`);
      console.log("🔹 Raw batch response:", JSON.stringify(batchRes.data, null, 2)); // <-- Important

      // Try multiple access patterns to locate batch data
      const allBatches =
        batchRes?.data?.data ||
        batchRes?.data?.batches ||
        batchRes?.data ||
        [];

      console.log("✅ Extracted batches array length:", Array.isArray(allBatches) ? allBatches.length : "not an array");

      // If it’s not an array, extract manually
      const extractedBatches = Array.isArray(allBatches)
        ? allBatches
        : batchRes.data?.data || [];

      studentBatches = extractedBatches;
    } catch (err) {
      console.error("Error fetching batches:", err.message);
    }

    // 🔹 Fetch course for each batch
    const batchesWithCourses = await Promise.all(
      (studentBatches || []).map(async (batch) => {
        let courseDetails = null;
        try {
          const courseId =
            typeof batch.courseId === "object"
              ? batch.courseId._id || batch.courseId.id
              : batch.courseId;

          console.log("📘 courseId found:", courseId);

          if (courseId) {
            const courseRes = await axios.get(
              `http://localhost:3001/api/courses/getCourseById/${courseId}`
            );
            courseDetails = courseRes.data?.data || null;
            console.log("✅ Course fetched:", courseDetails?.title);
          }
        } catch (err) {
          console.error(`Error fetching course for batch ${batch._id}:`, err.message);
        }

        return { ...batch, course: courseDetails };
      })
    );

    // 🔹 Final response
    res.status(200).json({
      success: true,
      message: "Student portfolio fetched successfully",
      data: {
        student,
        institute,
        batches: batchesWithCourses,
      },
    });
  } catch (error) {
    console.error("Error fetching student portfolio:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching student portfolio",
      error: error.message,
    });
  }
};
