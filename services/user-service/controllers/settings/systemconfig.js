import { syncIndexes } from "mongoose";
import SystemConfig from "../../models/setting/systemconfig.js";
import { logActivity } from "../../utils/ActivitylogHelper.js";

export const getSystemConfig = async (req, res) => {
  try {
    const config = await SystemConfig.findOne();
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const createSystemConfig = async (req, res) => {
  try {
    // Use the correct model
    const config = new SystemConfig(req.body);
    const user = req.user
    await config.save();
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "system config",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} system config Created successfully`,
    });

    res.status(201).json({
      Message: "Successfully created system config",
      Data: config,
      Status: "Success"
    });

  } catch (err) {
    res.status(500).json({ Message: "Server Error: " + err.message });
  }
};

export const updateSystemConfig = async (req, res) => {
  try {
    const updated = await SystemConfig.findOneAndUpdate({}, req.body, { new: true });
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "system config",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} system config Updatedsuccessfully`,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
