import express from 'express'
import { createBatch, deleteBatchByBatchId, getAllBatch, getBatchByBatchId, getBatchByCourse, getBatchBySearch, getBatchSetting, getContentByBatchId, updateBatchByBatchId, updateBatchSetting, updateContentByBatchId,getBatchByStudent,getallbatch, getBatchByInstitute } from '../../controllers/batch/batchControllers.js';
import { PermissionVerify } from '../../middelwares/index.js';


const batchRoute = express.Router();

batchRoute.get("/batch/all",getallbatch)
batchRoute.post("/:courseid/batch",PermissionVerify(["merchant"]),createBatch)
batchRoute.get("/:courseId/batch",PermissionVerify(["open","merchant","admin"]),getBatchByCourse)
batchRoute.get("/student/:studentId/batch",getBatchByStudent)
batchRoute.get("/batch/:merchantId",getAllBatch)
batchRoute.get("/:courseid/batch/:batchid",getBatchByBatchId)
batchRoute.put("/:courseid/batch/:batchid",PermissionVerify(["merchant"]),updateBatchByBatchId)
batchRoute.delete("/:courseid/batch/:batchid",PermissionVerify(["merchant"]),deleteBatchByBatchId)
batchRoute.get("/:courseid/batch/:batchid/content",getContentByBatchId)
batchRoute.put("/:courseid/batch/:batchid/content",PermissionVerify(["merchant"]),updateContentByBatchId)
batchRoute.put("/:courseid/batch/:batchid/feature",PermissionVerify(["merchant"]),updateBatchSetting)
batchRoute.get("/:courseid/batch/:batchid/feature",getBatchSetting)
batchRoute.get("/batch/search",getBatchBySearch)

batchRoute.get("/batch/bymerchant/getall",PermissionVerify(["merchant","open"]), getBatchByInstitute);

export default batchRoute