import dotenv from "dotenv";
import { InstituteReviewMap } from "../../models/institutereviewmodel/institutereviewmaopmodel.js";
import { InstituteReview } from "../../models/institutereviewmodel/institutereviewmodel.js";

dotenv.config();

export const createinstitutecontroll = async (req, res) => {
  try {
    const { instituteId, reviews } = req.body;

    if (!instituteId || !Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({
        message: "instituteId and at least one review are required",
        success: false,
      });
    }
    const createdReviews = await InstituteReview.insertMany(
      reviews.map((r) => ({ ...r, instituteId }))
    );

    const reviewIds = createdReviews.map((r) => r._id);

    const reviewMap = await InstituteReviewMap.findOneAndUpdate(
      { instituteId },
      { $push: { reviews: { $each: reviewIds } } },
      { new: true, upsert: true }
    ).populate("reviews");

    res.status(201).json({
      message: "Institute review(s) added and linked successfully",
      success: true,
      data: reviewMap,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getAllInstituteReviews = async (req, res) => {
  try {
    const reviews = await InstituteReviewMap.find()
      .populate("reviews")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All institute reviews fetched successfully",
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getReviewsByInstituteId = async (req, res) => {
  try {
    const { instituteId } = req.params;

    const instituteReviews = await InstituteReviewMap.findOne({ instituteId })
      .populate("reviews");

    if (!instituteReviews) {
      return res.status(404).json({
        message: "No reviews found for this institute",
        success: false,
      });
    }

    const avgRating =
      instituteReviews.reviews.length > 0
        ? instituteReviews.reviews.reduce((sum, r) => sum + r.rating, 0) /
          instituteReviews.reviews.length
        : 0;

    res.status(200).json({
      message: "Institute reviews fetched successfully",
      success: true,
      count: instituteReviews.reviews.length,
      averageRating: avgRating.toFixed(2),
      data: instituteReviews.reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const updateInstituteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid review ID format",
        success: false,
      });
    }

    const review = await InstituteReview.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return res.status(404).json({
        message: "Institute review not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Institute review updated successfully",
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteInstituteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid review ID format",
        success: false,
      });
    }

    const deletedReview = await InstituteReview.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({
        message: "Institute review not found",
        success: false,
      });
    }

    await InstituteReviewMap.updateOne(
      { reviews: id },
      { $pull: { reviews: id } }
    );

    res.status(200).json({
      message: "Institute review deleted successfully",
      success: true,
      data: deletedReview,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getInstituteReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid review ID format",
        success: false,
      });
    }

    const review = await InstituteReview.findById(id);
    if (!review) {
      return res.status(404).json({
        message: "Institute review not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Institute review fetched successfully",
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
