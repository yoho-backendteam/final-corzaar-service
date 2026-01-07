import express from "express";

const routes_Crud = express.Router()

import controlers from "../../controlls/Query/query.js";
import { PermissionVerify } from "../../middleware/index.js";

routes_Crud.post("/querysend",PermissionVerify(["student","merchant"]),controlers.querysend)
routes_Crud.put("/adminreplay/:queryId",PermissionVerify(["admin"]),controlers.adminqueryreply)
// routes_Crud.get("/queryview/:senderId/:senderRole",controlers.queryreceive)
routes_Crud.get("/queryview/:senderRole",PermissionVerify(["admin","merchant"]),controlers.queryreceive)
routes_Crud.put("/resolve/:queryId",controlers.markQueryResolved);
routes_Crud.get('/adminReceiveQueries',controlers.adminReceiveQueries)

export default routes_Crud 