import express from "express"
import { createInstitute, deleteinstitutebyid, getByIdInstitutes, getInstituteCourses, getInstitutes, getInstitutesByUserId, getInstitutesStudents, getNearbyInstitutes, searchInstitutes, updateInstitute} from "../controllers/index.js"
import { createInstituteValidation } from "../validation/index.js";
import { validate } from "../middlewares/validate.js";
import { updateInstituteValidation } from "../validation/update.js";
import { createBranch, deleteBranchByUUID, getAllBranches, getAllBranchesByInstitute, getBranchByUUID, getBranchesByInstitute, updateBranchByUUID } from "../controllers/branchController.js";
import { createPlacement, deletePlacementByUUID, getAllPlacementsC, getPlacementByUUID, getPlacementsByStudent, updatePlacementByUUID } from "../controllers/placementController.js";
import { validateCreateBranch, validateUpdateBranch } from "../middlewares/branchMiddleware.js";
import { validateCreatePlacement, validateUpdatePlacement } from "../middlewares/placementMiddleware.js";
import dashroute from './dashboardRoutes.js'
import AttendanceRoute from "./AttendanceManagement/index.js";
import { PermissionVerify } from "../../middelware/index.js";
import categoryroute from "./category/categoryroutes.js";


export const route = express.Router()

route.post("/",PermissionVerify(["merchant"]), createInstitute);
route.get("/getall",getInstitutes)
route.get('/getbyid/:id',getByIdInstitutes)
route.put('/update/:id',PermissionVerify(["merchant","admin"]),updateInstitute)
route.delete('/delete/:id',PermissionVerify(["merchant"]),deleteinstitutebyid)
route.get("/getall/:id/students",getInstitutesStudents)
route.get("/getall/:id/courses",getInstituteCourses)
route.get('/:id/search',searchInstitutes)
route.get('/getnearby',getNearbyInstitutes)
route.get('/getbyuserId/:id',getInstitutesByUserId)


route.post('/branch/createBranch',PermissionVerify(["merchant"]),validateCreateBranch, createBranch);
route.get('/branch/getAll',getAllBranches);
route.get("/branch/byinstitute",PermissionVerify(["merchant"]),getAllBranchesByInstitute)
route.get('/branch/institutes/:instituteId/branches', getBranchesByInstitute);
route.get('/branch/getbyuuid/:uuid', getBranchByUUID);
route.put('/branch/updatebyuuid/:uuid',PermissionVerify(["merchant"]), updateBranchByUUID);
route.delete('/branch/deletebyuuid/:uuid',PermissionVerify(["merchant"]), deleteBranchByUUID);


route.post('/placement/createPlacement',PermissionVerify(["merchant"]),validateCreatePlacement, createPlacement);
route.get('/placement/getall', getAllPlacementsC);
route.get('/placement/getbyUUID/:uuid', getPlacementByUUID);
route.put('/placement/updatebyUUID/:uuid',PermissionVerify(["merchant"]), updatePlacementByUUID);
route.delete('/placement/deletebyUUID/:uuid',PermissionVerify(["merchant"]), deletePlacementByUUID);
route.get('/placement/getbyid/:studentId', getPlacementsByStudent);

route.use('/category',categoryroute)

route.use('/dashboard',PermissionVerify(["merchant"]),dashroute)

route.use("/attendance",AttendanceRoute)

export default route;