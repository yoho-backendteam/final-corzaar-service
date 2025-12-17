import { errorResponse, generateUUID, successResponse } from "../../utils/helpcenter/helper.js";
import HelpCenter from "../../models/helpcenter/index.js";
import { logActivity } from "../../utils/ActivitylogHelper.js";

export const createArticle = async (req, res) => {
  const user = req.user
  try {
    const { title, category, content, keywords, role } = req.body;
    const uuid = generateUUID();

    const article = new HelpCenter({
      uuid,
      title,
      category,
      content,
      keywords,
      role,
    });

    await article.save();
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Article",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Article created successfully`,
    });
    return res
      .status(201)
      .json(successResponse("Article created successfully", article));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Failed to create article", error.message));

  }
};

export const getAllArticles = async (req, res) => {
  try {
    const { search, role } = req.query;

    const filter = {};
    if (role && role !== "all") {
      filter.role = { $in: [role, "all"] }; // show "all" + matching role
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    const articles = await HelpCenter.find(filter).sort({ createdAt: -1 });
    return res.json(successResponse("Articles fetched successfully", articles));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Failed to fetch articles", error.message));
  }
};
export const getAllArticlesCategory = async (req, res) => {
  try {
    const { search, role, category } = req.query;
    const filter = {};
    if (role) {
      filter.role = { $regex: new RegExp(`^${role}$`, "i") };
    }
    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    const articles = await HelpCenter.find(filter).sort({ createdAt: -1 });

    return res.json(successResponse("Articles fetched successfully", articles));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Failed to fetch articles", error.message));
  }
};

export const updateArticle = async (req, res) => {
  try {
    const user = req.user
    const updated = await HelpCenter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json(errorResponse("Article not found"));

    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Article",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Article updated successfully`,
    });
    return res.json(successResponse("Article updated successfully", updated));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Failed to update article", error.message));
  }
};
export const deleteArticle = async (req, res) => {
  try {
    const deleted = await HelpCenter.findByIdAndDelete(req.params.id);
    const user = req.user
    if (!deleted)
      return res.status(404).json(errorResponse("Article not found"));
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Article",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Article deleted successfully`,
    });
    return res.json(successResponse("Article deleted successfully", deleted));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Failed to delete article", error.message));
  }
};

