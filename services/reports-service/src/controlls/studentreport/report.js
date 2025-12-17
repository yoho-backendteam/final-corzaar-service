
import { v4 as uuidv4 } from "uuid";
import { ticketModel } from "../../models/studentreport/stureportmodel.js";
import { studentTicketSchema } from "../../validation/ticketvalidation.js";
import { logActivity } from "../../utils/ActivitylogHelper.js";

export const createTicket = async (req, res) => {
  try {
    const user = req.user
    const { error } = studentTicketSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const { studentId, title, description, category } = req.body;

    const newTicket = new ticketModel({
      ticketId: uuidv4(),
      studentId,
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
        : "User"} Ticket created successfully`,
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket: newTicket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating ticket",
      error: error.message,
    });
  }
};

export const getTicketsStudent = async (req, res) => {
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
        limit,
      },
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
    const ticket = await ticketModel.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({
      success: true,
      message: "Tickets fetched successfully",
      count: ticket.length,
      ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching ticket", error: error.message });
  }
};


export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = req.user
    const ticket = await ticketModel.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });


    if (ticket.status === "Resolved") {
      return res.status(400).json({ message: "Cannot edit a resolved ticket" });
    }

    const updatedTicket = await ticketModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true }
    );
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
      success: true,
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating ticket", error: error.message });
  }
};


export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const user =req.user
    const ticket = await ticketModel.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (ticket.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Cannot delete a ticket that is already in process or resolved" });
    }

    await ticketModel.findByIdAndDelete(id);
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Ticket",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Ticket Deleted successfully`,
    });

    res.status(200).json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting ticket", error: error.message });
  }
};
