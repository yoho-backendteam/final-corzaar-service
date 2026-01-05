import NotificationSettings from "../../models/setting/notification.js";
import { logActivity } from "../../utils/ActivitylogHelper.js";

export const getNotificationSettings = async (req, res) => {
  try {
    const settings = await NotificationSettings.findOne();
    res.status(200).json({
      message: "setting prefrence got successfully ",
      data: settings,
      success: true
  });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateNotificationSettings = async (req, res) => {
  try {
    const user = req.user
    const updated = await NotificationSettings.findOneAndUpdate({}, req.body, { new: true });
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Notification Setting",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Notification Setting Updated successfully`,
    });
    res.status(200).json({
      message: "setting preference updated successfully",
      data: updated,
      success: true
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
