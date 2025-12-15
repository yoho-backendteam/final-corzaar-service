import { Offer } from "../../models/offerSchema.js";
import { generateUUID } from "../../utils/helpcenter/helper.js";
import { offerUpdateValidation, offerValidation } from "../../validations/offerValidation.js";
import axios from "axios";

// get Course by Id
const getCourseById = async(url) => {
    try {
    
        const response = await axios.get(url);
        return response
    } catch (error) {
        console.log(error);
    }
} 

// Create Offer
export const createOffer = async (req, res) => {
  console.log("entry");
  console.log("req body etry",req.body);
  
  
  try {
    console.log("entry try");   
    
    const { error } = offerValidation.validate(req.body);
    console.log("status",error);
    
    
    if (error) return res.status(400).json({ message: error.details[0].message });
    console.log("before");
    // console.log("from other",generateUUID());       
    const UUID=generateUUID()     
    console.log("uuid",UUID);   
    ("uuid",UUID)
    // console.log("req",req);
    
    console.log("body",req.body);
    
    req.body.uuid = UUID;
    console.log("after check",req.body.uuid);
    const offer = await Offer.create(req.body);
    res.status(201).json(offer);
  } catch (err) {    
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get All Offers
export const getOffers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit
    const offers = await Offer.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const totalOffers = await Offer.countDocuments();

    res.status(200).json({
      status : "Success",
      message: "offer data successfully fetched",
      currentPage: page,
      totalPages: Math.ceil(totalOffers / limit),
      totalOffers,
      offers,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Offer By ID
export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    const data = await getCourseById(`http://localhost:3001/api/courses/getCourseById/${offer.courseId}`)
    const courseData = data.data;
    res.status(200).json({data : {offer,courseData}});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Offer
export const updateOffer = async (req, res) => {
  const { id } = req.params;  

  try {
    const { error } = offerUpdateValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    if ("status" in req.body) {
      delete req.body.status;
    }
 
    const offer = await Offer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!offer)
      return res.status(404).json({ message: "Offer not found" });

    res.status(200).json({
      status: true,
      message: "Offer updated successfully",
      data: offer,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Offer
export const deleteOffer = async (req, res) => {
    const {id} = req.params
    console.log("delete params",req.params);
    
  try {
    console.log("entry in try");
    
    const offer = await Offer.findByIdAndDelete(id);
    console.log("offer",offer);
    
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update Status 

export const statusUpdate = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  try {
    if (!status) {
      return res.status(400).json({ status: false, message: "Status is required" });
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ status: false, message: "Offer not found" });
    }

    res.status(200).json({
      status: true,
      data: updatedOffer,
      message: "Status updated successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
