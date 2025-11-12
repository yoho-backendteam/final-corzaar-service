import express from "express";
import Joi from "joi";

const routes_Crud = express.Router()

import controlers from "../../controlls/Query/query.js";

routes_Crud.post("/querysend",controlers.querysend)
routes_Crud.get("/queryview/:senderId/:senderRole",controlers.queryreceive)
routes_Crud.post("/adminreplay",controlers.adminqueryreply)

export default routes_Crud 