// import nodemailer from 'nodemailer';
// // import { Student } from '../../models/Student/index.js';
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });
// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);

// export const sendAbsentNotification = async (req, res, next) => {
//     try {
//         const { attendance } = req.body;
//         const absentStudents = attendance.filter(a => a.status === 'Absent');

//         if (absentStudents.length > 0) {
//             // const studentIds = absentStudents.map(a => a.studentId);
//             // const students = await Student.find({ _id: { $in: studentIds } });
//             const students = absentStudents.map((a) => ({
//                 _id: a.studentId,
//                 name: `Student `,
//                 email: process.env.TEST_EMAIL
//             }));
//             const emailPromises = students.map(student => {
//                 const mailOptions = {
//                     from: process.env.EMAIL_USER,
//                     to: student.email,
//                     subject: 'Attendance Alert - You were marked Absent',
//                     html: `
//                         <h2>Attendance Notification</h2>
//                         <p>Dear ${student.name},</p>
//                         <p>You were marked <strong>Absent</strong> for today's class.</p>
//                         <p>Date: ${new Date(req.body.date || Date.now()).toLocaleDateString()}</p>
//                         <p>Student ID: ${student._id}</p>
//                         <p>If you believe this is an error, please contact your instructor.</p>
//                         <br>
//                         <p>Best regards,</p>
//                         <p>Your Institute</p>
//                     `
//                 };
//                 return transporter.sendMail(mailOptions);
//             });
//             await Promise.all(emailPromises);
//             console.log(`Sent ${absentStudents.length} absence notification(s) to ${students[0].email}`);
//         }
//         next();
//     } catch (error) {
//         console.error('Error sending notifications:', error.message);
//         next();
//     }
// };
