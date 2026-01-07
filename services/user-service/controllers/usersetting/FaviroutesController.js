import Favorite from "../../models/usersettingModel/FavoritesModel.js";

export const getFavorites = async (req, res) => {
  try {
    const { userid } = req.params;
    if (!userid) return res.status(400).json({ success: false, message: "User ID is required" });

    const favorites = await Favorite.find({ userid });

    res.status(200).json({
      success: true,
      message: "Favorites fetched successfully",
      data: favorites.length ? favorites : [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
