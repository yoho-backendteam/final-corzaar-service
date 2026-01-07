import { Offer } from "../../models/offerSchema.js";
import { generateUUID } from "../../utils/helpcenter/helper.js";
import { offerUpdateValidation, offerValidation } from "../../validations/offerValidation.js";
import axios from "axios";

// get Course by Id
const getCourseById = async (url) => {
  try {

    const response = await axios.get(url);
    return response
  } catch (error) {
    console.log(error);
  }
}

// Create Offer
export const createOffer = async (req, res) => {
  const user = req.user
  try {
    const { error } = offerValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    req.body.uuid = generateUUID();
    const offer = await Offer.create(req.body);
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "offers",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Offer Created successfully`,
    });
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
      status: "Success",
      message: "offer data successfully fetched",
      currentPage: page,
      totalPages: Math.ceil(totalOffers / limit),
      totalOffers,
      offers,
    });

  } catch (err) {
    console.error(err)
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
    res.status(200).json({ data: { offer, courseData } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Offer
export const updateOffer = async (req, res) => {
  const { id } = req.params;

  const user = req.user
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

    // logActivity({
    //   userid: user._id.toString(),
    //   actorRole: user?.role
    //     ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    //     : "",
    //   action: "offers",
    //   description: `${user?.role
    //     ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    //     : "User"} Offer Updated successfully`,
    // });

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
  const { id } = req.params
  try {
    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "offers",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Offer delete successfully`,
    });
    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update Status 

export const statusUpdate = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user

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
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "offers",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Status Updated successfully`,
    });

    res.status(200).json({
      status: true,
      data: updatedOffer,
      message: "Status updated successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
