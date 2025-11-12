import Enrollment from "../../models/studentmanagment/Enrollment.js";
import { generateEnrollmentPDFBuffer } from "../../pdf/enrollmentPdf.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import student_management from "../../models/studentmanagment/student_management.js";
import axios from "axios";

dotenv.config();

export const createEnrollmentApplication = async (req, res) => {
  try {
    const { userId, items, coupon, payment, status } = req.body;

    
    const student = await student_management.findById(userId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const billing = {
      firstName: student.personalInfo?.firstName || "N/A",
      lastName: student.personalInfo?.lastName || "N/A",
      email: student.personalInfo?.email || "N/A",
      phone: student.personalInfo?.phoneNumber || "N/A",
      address: student.personalInfo?.address || {},
    };

    
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        try {
          const { data: course } = await axios.get(
            `http://localhost:5001/api/courses/${item.courseId}`
          );
          return {
            courseId: course._id,
            title: course.title,
            price: course.pricing?.price || 0,
            discountPrice: course.pricing?.discount || 0,
            instituteId: course.instituteId,
          };
        } catch (error) {
          console.error("Course fetch failed:", error.message);
          return item;
        }
      })
    );

   
    const subtotal = populatedItems.reduce((sum, item) => sum + item.price, 0);
    const discount = populatedItems.reduce((sum, item) => sum + item.discountPrice, 0);
    const total = subtotal - discount;
    const tax = 0;

    const calculatedPricing = {
      subtotal,
      discount,
      tax,
      total,
      currency: "INR",
    };

    
    const enrollment = new Enrollment({
      userId,
      items: populatedItems,
      pricing: calculatedPricing,
      coupon,
      payment,
      billing,
      status,
    });

    await enrollment.save();

  
    const pdfBuffer = await generateEnrollmentPDFBuffer(enrollment);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: billing.email,
      subject: `Enrollment Confirmation - ${enrollment.orderId}`,
      text: `Dear ${billing.firstName},

Thank you for enrolling! Please find your enrollment application attached.

Best regards,
Corzaar Team`,
      attachments: [
        {
          filename: `Enrollment_${enrollment.orderId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);


    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=Enrollment_${enrollment.orderId}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Enrollment creation failed:", err);
    res.status(500).json({ error: err.message });
  }
};
