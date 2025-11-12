import activityLogValidation from "../../validations/activelog/activelog.js";
import ActivityLog from "../../models/activelog/activelog_schema.js";

export const createActivityLog = async (req, res) => {
  try {
    const { error } = activityLogValidation.validate(req.body);
    if (error)
      return res.status(400).json({ Message: `Validation Error: ${error.message}` });

    const log = new ActivityLog(req.body);
    const savedLog = await log.save();

    res.status(201).json({
      Message: "Activity logged successfully",
      Data: savedLog,
    });
  } catch (err) {
    res.status(500).json({ Message: `Server Error: ${err.message}` });
  }
};

export const getAllActivityLogs = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({ Message: "User ID is required" });
    }

    const logs = await ActivityLog.find({ userid }).sort({ createdAt: -1 });

    if (logs.length === 0) {
      return res.status(404).json({ Message: "No activity logs found for this user" });
    }

    res.status(200).json({
      Message: "Logs fetched successfully",
      Data: logs,
    });
  } catch (err) {
    res.status(500).json({ Message: `Server Error: ${err.message}` });
  }
};

export const updateActivityLogByUserId = async (req, res) => {
  try {
    const { userid } = req.params;
    const updateData = req.body;

    if (!userid) {
      return res.status(400).json({ Message: "User ID is required" });
    }

    const result = await ActivityLog.updateMany(
      { userid: userid.toString() },
      { $set: updateData }
    );

    if (!result.matchedCount && result.modifiedCount === 0) {
      return res.status(404).json({ Message: "No activity logs found for this user" });
    }

    res.status(200).json({
      Message: `Activity logs updated successfully for user ${userid}`,
      MatchedCount: result.matchedCount,
      ModifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ Message: `Server Error: ${err.message}` });
  }
};

export const deleteActivityLog = async (req, res) => {
  try {
    const { userid } = req.params;

    if (!userid) {
      return res.status(400).json({ Message: "User ID is required" });
    }

    const result = await ActivityLog.deleteMany({ userid });

    if (result.deletedCount === 0) {
      return res.status(404).json({ Message: "No activity logs found for this user" });
    }

    res.status(200).json({
      Message: "Activity logs deleted successfully for this user",
      DeletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ Message: `Server Error: ${err.message}` });
  }
};

export const getAllActivityByRole = async (req, res) => {
  try {
    const { role } = req.params; 

    const filter = role ? { actorRole: role } : {};

    const activities = await ActivityLog.find(filter).sort({ createdAt: -1 });

    if (activities.length === 0) {
      return res.status(404).json({
        success: false,
        message: role
          ? `No activities found for role: ${role}`
          : "No activities found",
      });
    }

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching activities",
      error: error.message,
    });
  }
};
