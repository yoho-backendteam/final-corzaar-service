import { Course } from "../../models/coursemodel.js";
import { logActivity } from "../../utils/ActivitylogHelper.js";

// GET /api/courses/:id/content
export const getCourseContent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course.content);
  } catch (err) {
    res.status(500).json({ message: "Error fetching content", error: err.message });
  }
};

// POST /api/courses/:id/content
export const addCourseContent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = req.user
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Example: push new module
    course.content.modules.push(req.body);
    await course.save();
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Content",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Content Created successfully`,
    });

    res.status(201).json(course.content);
  } catch (err) {
    res.status(500).json({ message: "Error adding content", error: err.message });
  }
};

// PUT /api/courses/:id/content/:contentId
export const updateCourseContent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = req.user;
    if (!course) return res.status(404).json({ message: "Course not found" });

    const module = course.content.modules.id(req.params.contentId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    Object.assign(module, req.body);
    await course.save();
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Content",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Content Update successfully`,
    });
    res.json(module);
  } catch (err) {
    res.status(500).json({ message: "Error updating content", error: err.message });
  }
};

// DELETE /api/courses/:id/content/:contentId
export const deleteCourseContent = async (req, res) => {
  try {
    const { id, contentId } = req.params;
    const user = req.user
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Find the index of the module inside content.modules
    const moduleIndex = course.content.modules.findIndex(
      (mod) => mod._id.toString() === contentId
    );

    if (moduleIndex === -1)
      return res.status(404).json({ message: "Module not found" });

    // Remove the module
    course.content.modules.splice(moduleIndex, 1);

    // Save the course
    await course.save();
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Content",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Content deleted successfully`,
    });

    res.json({ message: "Module deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting content", error: err.message });
  }
};

