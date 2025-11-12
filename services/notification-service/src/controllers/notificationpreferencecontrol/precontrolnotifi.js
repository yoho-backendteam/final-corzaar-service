import NotificationPreference from "../../models/notificationpreference/preferencemodal.js";
// import Institute from "../../../../merchant-service/institute/models/index.js";

export const createPreference = async (req, res) => {
  try {
    const preference = await NotificationPreference.create(req.body);
    res.status(201).json({
      success: true,
      message: "Notification preference created successfully",
      data: preference
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



export const getAllPreferences = async (req, res) => {
  try {
    const preferences = await NotificationPreference.find();

    res.status(200).json({
      success: true,
      message: "Notification preferences fetched successfully",
      count: preferences.length,
      data: preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getPreferenceByMerchant = async (req, res) => {
  try {
    const preference = await NotificationPreference.findOne({
      merchantId: req.params.merchantId,
    }).populate("merchantId");

    if (!preference) {
      return res.status(404).json({ success: false, message: "Preference not found" });
    }

    res.status(200).json({
      success: true,
      message: "Fetched data successfully",
      preference,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updatePreference = async (req, res) => {
  try {
    const updated = await NotificationPreference.findOneAndUpdate(
      { merchantId: req.params.merchantId },
      req.body,
      { new: true }
    ).populate("merchantId");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Preference not found" });
    }

    res.status(200).json({
      success: true,
      message: "Preference updated successfully",
      updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePreference = async (req, res) => {
  try {
    const deleted = await NotificationPreference.findOneAndDelete({
      merchantId: req.params.merchantId,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Preference not found" });
    }

    res.status(200).json({
      success: true,
      message: "Preference deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
