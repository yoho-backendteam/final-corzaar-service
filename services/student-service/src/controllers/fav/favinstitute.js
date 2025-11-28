import mongoose from "mongoose";
import InstituteFavorites from "../../models/fav/favinstitute.js";
import { successResponse, errorResponse } from "../../utils/index.js";

export const addInstituteFav = async (req, res) => {
  try {
    const { userId, instituteId } = req.body;

    // Check if already exists
    const existingFav = await InstituteFavorites.findOne({
      userId,
      instituteId,
      isdeleted: false,
    });

    if (existingFav) {
      return res.status(400).json({ message: "Institute already in favorites" });
    }

    // Create new favorite
    const newFav = new InstituteFavorites({ userId, instituteId });
    await newFav.save();

    res.status(201).json({ message: "Institute added to favorites", data: newFav });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getInstituteFav = async (req, res) => {
  try {
    const { userId } = req.params;

    const fav = await InstituteFavorites.findOne({
      userId,
      isactive: true,
      isdeleted: false,
    });

    return successResponse(
      res,
      "Favorites fetched successfully",
      fav || { favorites: [] }
    );

  } catch (err) {
    return errorResponse(res, err.message);
  }
};


export const removeInstituteFav = async (req, res) => {
  try {
    const { userId } = req.body;
    const { instituteId } = req.params;

    if (!userId || !instituteId) {
      return errorResponse(res, "userId and instituteId are required");
    }

    if (!mongoose.Types.ObjectId.isValid(instituteId)) {
      return errorResponse(res, "Invalid instituteId format");
    }

    const fav = await InstituteFavorites.findOne({
      userId,
      instituteId,
      isactive: true,
      isdeleted: false,
    });

    if (!fav) {
      return errorResponse(res, "Favorite not found");
    }

    fav.isdeleted = true;
    fav.isactive = false;
    await fav.save();

    return successResponse(res, "Institute removed from favorites", fav.toObject());
  } catch (err) {
   
    return errorResponse(res, err.message);
  }
};

