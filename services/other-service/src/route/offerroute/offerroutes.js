import express from "express";
import {
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  statusUpdate,
} from "../../controllers/offerControllers/offers.js";
import { authorize } from "../../middleware/authorizationClient.js";
import { PermissionVerify } from "../../middleware/index.js";


const offerRouter = express.Router();

offerRouter.post("/",PermissionVerify(["merchant"]), createOffer);
offerRouter.get("/all",PermissionVerify(["open","merchant","admin"]), getOffers);
offerRouter.put("/status/:id",PermissionVerify(["admin"]),statusUpdate)
offerRouter.get("/:id", getOfferById);
offerRouter.put("/:id",
  PermissionVerify(["merchant"]),
  updateOffer);
offerRouter.delete("/:id",
  PermissionVerify(["merchant"]),
   deleteOffer);

export default offerRouter;
