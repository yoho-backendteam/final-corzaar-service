import NotificationSettings from "../../models/setting/notification.js";

export const getNotificationSettings = async (req, res) => {
  try {
    const settings = await NotificationSettings.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateNotificationSettings = async (req, res) => {
  try {
    const updated = await NotificationSettings.findOneAndUpdate({}, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
