import mongoose from "mongoose";
import FavoriteCourses from "../../models/fav/index.js";
import CartCourses from "../../models/cart/index.js";
import { successResponse, errorResponse } from "../../utils/index.js";
import { calculateTotals } from "../../utils/index.js";

export const addToFavorites = async (req, res) => {
  try {
    const userId = req.user?._id
    const { courseId, title, price, discountPrice, instituteId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return errorResponse(res, "Invalid userId format");

    if (!mongoose.Types.ObjectId.isValid(courseId))
      return errorResponse(res, "Invalid courseId format");

    let fav = await FavoriteCourses.findOne({ userId, isactive: true, isdeleted: false });

    if (!fav) {
      fav = new FavoriteCourses({ userId, items: [] });
    }

    const exists = fav.items.find((i) => i.courseId.toString() === courseId.toString());
    if (exists) return successResponse(res, "Course already in favorites", fav);

    fav.items.push({ courseId, title, price, discountPrice, instituteId });
    await fav.save();

    return successResponse(res, "Course added to favorites", fav);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};


export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return errorResponse(res, "userId required");
    const fav = await FavoriteCourses.findOne({ userId, isactive: true, isdeleted: false });
    if (!fav) return errorResponse(res, "No favorites found");
    return successResponse(res, "Favorites fetched successfully", fav);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};


export const removeFavoriteList = async (req, res) => {
  try {
    const { userId } = req.body;
    const { courseId } = req.params; 

    if (!userId || !courseId)
      return errorResponse(res, "userId and courseId are required");

    const fav = await FavoriteCourses.findOne({
      userId,
      isactive: true,
      isdeleted: false,
    });

    if (!fav) return errorResponse(res, "Favorites not found");

    const index = fav.items.findIndex(
      (i) => i.courseId.toString() === courseId.toString()
    );

    if (index === -1)
      return errorResponse(res, "Course not found in favorites");

    fav.items.splice(index, 1);
    await fav.save();

    return successResponse(res, "Course removed from favorites", fav);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const moveToCart = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId)
      return errorResponse(res, "userId and courseId are required");

    // Ensure valid ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(courseId)
    )
      return errorResponse(res, "Invalid ID format");

    // Find favorite list for the user
    const fav = await FavoriteCourses.findOne({ userId, isactive: true });
    if (!fav) return errorResponse(res, "Favorites not found");

    // Find the item to move
    const favItem = fav.items.find(
      (item) => item.courseId.toString() === courseId.toString()
    );
    if (!favItem) return errorResponse(res, "Course not found in favorites");

    // Add to cart
    let cart = await CartCourses.findOne({ userId, isactive: true });
    if (!cart) {
      cart = new CartCourses({
        userId,
        items: [favItem],
        pricing: calculateTotals([favItem]),
      });
    } else {
      const exists = cart.items.some(
        (i) => i.courseId.toString() === courseId.toString()
      );
      if (!exists) cart.items.push(favItem);
      cart.pricing = calculateTotals(cart.items);
    }
    await cart.save();

    // ❗ Remove from favorites safely
    fav.items = fav.items.filter(
      (item) => item.courseId.toString() !== courseId.toString()
    );
    await fav.save();

    return successResponse(res, "Course moved to cart successfully", { cart, fav });
  } catch (err) {
    return errorResponse(res, err.message || "Server error");
  }
};
// Clear favorites
export const clearFavorites = async (req, res) => {
  try {
    const { userId } = req.body;
    const favorites = await FavoriteCourses.findOne({ userId, isactive: true });
    if (!favorites) return errorResponse(res, "Favorites not found");

    favorites.items = [];
    await favorites.save();

    return successResponse(res, "Favorites cleared", favorites);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};