import express from 'express';
import { createStudent, deleteStudentById, getAcademicInfoById, getAllStudents, getStudentById, searchStudents, updateStudentById } from '../../controllers/studentmanagement/student_management.js';
import {getStudentPortfolio} from '../../controllers/studentmanagement/studentPortfolio.js'
import { PermissionVerify } from '../../middelwares/index.js';

const studentRouter = express.Router();


studentRouter.post('/create',PermissionVerify(["student","noob"]),createStudent);
studentRouter.get("/getall",getAllStudents)
studentRouter.get("/getbyid/:id",getStudentById)
studentRouter.put("/updatebyid/:id",PermissionVerify(["student","noob"]),updateStudentById)
studentRouter.delete("/deletebyid/:id",PermissionVerify(["student","noob"]),deleteStudentById)
studentRouter.get("/getacademicbyid/:id",getAcademicInfoById)
studentRouter.get("/searchstudent",searchStudents)


studentRouter.get("/getBatch/:id",getStudentPortfolio)



export default studentRouter;
