import { CourseReviewMap } from "../../models/coursereviewmodel/coursereviewmapmodel.js";
import { CourseReview } from "../../models/coursereviewmodel/coursereviewmodel.js";
import { logActivity } from "../../utils/ActivitylogHelper.js";

export const createcoursereview = async (req, res) => {
    try {
        const { courseId, reviews } = req.body;
        const user = req.user
        if (!courseId || !Array.isArray(reviews) || reviews.length === 0) {
            return res.status(400).json({
                message: "courseId and at least one review are required",
                success: false,
            });
        }
        const createdReviews = await CourseReview.insertMany(
            reviews.map((r) => ({ ...r, courseId }))
        );
        const reviewIds = createdReviews.map((r) => r._id);
        const reviewMap = await CourseReviewMap.findOneAndUpdate(
            { courseId },
            { $push: { reviews: { $each: reviewIds } } },
            { new: true, upsert: true }
        ).populate("reviews");
        logActivity({
            userid: user._id.toString(),
            actorRole: user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "",
            action: "Course review",
            description: `${user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "User"} Course review created successfully`,
        });

        res.status(201).json({
            message: "Course review(s) added and linked successfully",
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

export const getAllCourseReviews = async (req, res) => {
    try {
        const reviews = await CourseReviewMap.find()
            .populate("reviews")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All course reviews fetched successfully",
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

export const getReviewsByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        const courseReviews = await CourseReviewMap.findOne({ courseId }).populate(
            "reviews"
        );

        if (!courseReviews) {
            return res.status(404).json({
                message: "No reviews found for this course",
                success: false,
            });
        }

        const avgRating =
            courseReviews.reviews.length > 0
                ? courseReviews.reviews.reduce((sum, r) => sum + r.rating, 0) /
                courseReviews.reviews.length
                : 0;

        res.status(200).json({
            message: "Course reviews fetched successfully",
            success: true,
            count: courseReviews.reviews.length,
            averageRating: avgRating.toFixed(2),
            data: courseReviews.reviews,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
};

export const updateCourseReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const user = req.user
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid review ID format",
                success: false,
            });
        }

        const review = await CourseReview.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!review) {
            return res.status(404).json({
                message: "Course review not found",
                success: false,
            });
        }

        logActivity({
            userid: user._id.toString(),
            actorRole: user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "",
            action: "Course review",
            description: `${user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "User"} Course review updated successfully`,
        });
        res.status(200).json({
            message: "Course review updated successfully",
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

export const deleteCourseReview = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid review ID format",
                success: false,
            });
        }

        const deletedReview = await CourseReview.findByIdAndDelete(id);
        if (!deletedReview) {
            return res.status(404).json({
                message: "Course review not found",
                success: false,
            });
        }

        await CourseReviewMap.updateOne(
            { reviews: id },
            { $pull: { reviews: id } }
        );
        logActivity({
            userid: user._id.toString(),
            actorRole: user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "",
            action: "Course review",
            description: `${user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "User"} Course review deleted successfully`,
        });
        res.status(200).json({
            message: "Course review deleted successfully",
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

export const getCourseReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "Invalid review ID format",
                success: false,
            });
        }

        // Find review by ID
        const review = await CourseReview.findById(id);

        if (!review) {
            return res.status(404).json({
                message: "Course review not found",
                success: false,
            });
        }

        res.status(200).json({
            message: "Course review fetched successfully",
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
