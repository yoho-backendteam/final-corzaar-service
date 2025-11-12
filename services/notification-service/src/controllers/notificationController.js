import { Notification } from "../models/notificationModel.js";
import {
  createNotificationSchema,
  updateNotificationSchema,
} from "../validations/notificationValidation.js";

import webpush from "web-push";

const publicVapidKey = "BN_WyNtu64YOPOPXLRWkJ_90n9OvVHxFuHdUequUOMuCOlDeHMWCHnw_jRP7GHAFXW_o4uFG5MSSOX6pT_6WW_c";
const privateVapidKey = "sF1x-Fwd2jYs6x01ToltQeVQk4zjYbqsALa98HjIZ-s";

webpush.setVapidDetails(
  'mailto:aravinth.yoho@gmail.com',
  publicVapidKey,
  privateVapidKey
);

//  Create Notification
export const createNotification = async (req, res) => {
  try {
    const data = req.body;

    if (Array.isArray(data)) {
      for (const item of data) {
        const { error } = createNotificationSchema.validate(item);
        if (error) {
          return res.status(400).json({
            success: false,
            message: `Validation failed: ${error.details[0].message}`,
          });
        }
      }

      // Insert all notifications at once
      const notifications = await Notification.insertMany(data);
      return res.status(201).json({
        success: true,
        count: notifications.length,
        data: notifications,
      });
    }

    // Single notification validation
    const { error } = createNotificationSchema.validate(data);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Create a single notification
    const notification = await Notification.create(data);
    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Mark Notification as Read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Notification marked as read", data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




//  Get Notifications with filters (receiverId, type, isRead)
export const getNotificationsByType = async (req, res) => {
  try {
    const { type, receiverId, isRead, page = 1, limit = 10 } = req.query;

    const validTypes = ["student", "merchant", "admin"];
    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Must be one of: student, merchant, admin",
      });
    }

    //  Build dynamic filter
    const filter = {};
    if (type) filter.type = type;
    if (receiverId) filter.receiverId = receiverId;
    if (isRead !== undefined) filter.isRead = isRead === "true"; 

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Notification.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching notifications",
      error: error.message,
    });
  }
};

// Get All Notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Notification by ID
export const getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification)
      return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Update Notification
export const updateNotification = async (req, res) => {
  try {
    const { error } = updateNotificationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const webshow=async (req, res) => {
//   const subscription = req.body;
//   console.log("subscription------>", subscription);

//   try {
//     // const latest = await Notification.findOne().sort({ createdAt: -1 });
//         const latest = await Notification.find();

//     console.log("latest----->",latest);
    

//     if (!latest) {
//       return res.status(404).json({ message: "No notification found in DB" });
//     }

//     const payload = JSON.stringify({ title: latest.title });
//     console.log("payload",payload);
    

//     console.log("two");

//     await webpush.sendNotification(subscription, payload);
//     console.log("three");
//     res.status(200).json({ message: "Notification sent successfully!" });
//     console.log("four");

//   } catch (error) {
//     console.error("Push Error:", error);
//     res.status(500).json({ error: "Failed to send notification" });
//   }
// }

export const webshow = async (req, res) => {
  const subscription = req.body;
  console.log("Subscription received:", subscription);

  try {
    // Get the latest notification document
    const latest = await Notification.findOne().sort({ createdAt: -1 });
    // const latest = await Notification.find();
    console.log("Latest Notification:", latest);

    if (!latest) {
      return res.status(404).json({ message: "No notification found in DB" });
    }

  
  
    // Prepare push payload
    const payload = JSON.stringify({
      title: latest.title || "New Notification",
      body: latest.message || "You have a new alert!",
      type: latest.type || "general",
      timestamp: latest.createdAt,
    });

    console.log("Payload:", payload);

    // Send push notification
    await webpush.sendNotification(subscription, payload);

    res.status(200).json({ message: "Notification sent successfully!" });

  } catch (error) {
    console.error("Push Error:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
};

