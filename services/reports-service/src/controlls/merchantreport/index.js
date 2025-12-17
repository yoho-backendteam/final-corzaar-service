
import { v4 as uuidv4 } from "uuid";
import { ticketModel } from "../../models/merchantreport/reportmodel.js";
import { ticketValidationSchema } from "../../validation/ticketvalidation.js";
import { logActivity } from "../../utils/ActivitylogHelper.js";

export const createTicket = async (req, res) => {
  try {
    const user = req.user
    const { error } = ticketValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const { instituteId, title, description, category } = req.body;

    const newTicket = new ticketModel({
      ticketId: uuidv4(),
      instituteId,
      title,
      description,
      category,
    });

    await newTicket.save();
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Ticket",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"}  Ticket created successfully`,
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: newTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating ticket",
      error: error.message,
    });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tickets = await ticketModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTickets = await ticketModel.countDocuments();

    res.status(200).json({
      success: true,
      message: "Tickets fetched successfully",
      data: tickets,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTickets / limit),
        totalTickets,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tickets",
      error: error.message,
    });
  }
};



export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await ticketModel
      .findOne({ $or: [{ _id: id }, { ticketId: id }] })


    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket fetched successfully",
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching ticket",
      error: error.message,
    });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actionTaken } = req.body;
    const user = req.user

    const updatedTicket = await ticketModel.findByIdAndUpdate(
      id,
      { status, actionTaken, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({
        status: "failed",
        success: false,
        message: "Ticket not found",
      });
    }
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Ticket",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Ticket updated successfully`,
    });
    res.status(200).json({
      status: "success",
      success: true,
      message: "Ticket updated successfully",
      data: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({
      status: "error", // ✅ Added for consistency
      success: false,
      message: "Error updating ticket",
      error: error.message,
    });
  }
};



export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user
    const deletedTicket = await ticketModel.findByIdAndDelete(id);
    if (!deletedTicket)
      return res.status(404).json({ message: "Ticket not found" });
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Ticket",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Ticket updated successfully`,
    });

    res.status(200).json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting ticket", error: error.message });
  }
};
