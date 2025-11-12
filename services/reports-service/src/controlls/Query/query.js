
import AdminRegister from "../../models/Query/user_schema.js"
import Query from "../../models/Query/query_schema.js"
import { queryValidationSchema, queryReceiveSchema } from "../../validation/Query/query.js";

const querysend = async (req, res) => {
  const { senderid, query, senederrole } = req.body;
  console.log("query", req.body);

  const { error } = queryValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      Message: "Validation failed",
      Errors: error.details.map((err) => err.message),
    });
  }

  try {
    if (!["User", "Admin", "Merchant"].includes(senederrole)) {
      return res.status(400).json({ Message: "Welcome third party man" });
    }

    if (senederrole === "User") {
      const find_the_id = await AdminRegister.findById(senderid);
      if (!find_the_id) {
        return res.status(404).json({ Message: "User not found" });
      }

      const admin = await AdminRegister.findOne({ role: "Admin" });
      if (!admin) {
        return res.status(404).json({ Message: "Admin not found" });
      }

      const currentDate = new Date();

      const newQuery = new Query({
        senderId: find_the_id._id,
        receiverId: admin._id,
        senederrole: "User",
        queries: {
          senederrole: "User",
          query: query,
          date: currentDate,
        },
        status: "incompleted",
      });

      await newQuery.save();

      return res.status(200).json({
        Message: "Query sent successfully to admin",
        data: { query: newQuery, user: find_the_id },
      });
    }

    if (senederrole === "Admin") {
      const find_the_id = await AdminRegister.findById(senderid);
      if (!find_the_id) {
        return res.status(404).json({ Message: "Admin not found" });
      }

      const currentDate = new Date();
      const newQuery = new Query({
        senderId: find_the_id._id,
        receiverId: find_the_id._id,
        senederrole: "Admin",
        queries: {
          senederrole: "Admin",
          query,
          date: currentDate,
        },
        status: "incompleted",
      });

      await newQuery.save();

      return res.status(200).json({
        Message: "Admin query saved successfully",
        data: newQuery,
      });
    }

    if (senederrole === "Merchant") {
      const find_the_id = await AdminRegister.findById(senderid);
      if (!find_the_id) {
        return res.status(404).json({ Message: "Merchant not found" });
      }

      const admin = await AdminRegister.findOne({ role: "Admin" });
      if (!admin) {
        return res.status(404).json({ Message: "Admin not found" });
      }

      const currentDate = new Date();

      const newQuery = new Query({
        senderId: find_the_id._id,
        receiverId: admin._id,
        senederrole: "Merchant",
        queries: {
          senederrole: "Merchant",
          query,
          date: currentDate,
        },
        status: "incompleted",
      });

      await newQuery.save();

      return res.status(200).json({
        Message: "Merchant query sent successfully to admin",
        data: { query: newQuery, 
          // user: find_the_id 
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      Message: "Something went wrong: " + error.message,
    });
  }
};


// controllers/queryController.js
export const queryreceive = async (req, res) => {
  const { senderId, senderRole } = req.params;
  console.log("Received request for senderId, senderRole:", senderId, senderRole);

  // Validate request
  const { error } = queryReceiveSchema.validate({ senderId, senderRole });
  if (error) {
    return res.status(400).json({
      Message: "Validation failed",
      Errors: error.details.map((err) => err.message),
    });
  }

  try {
    // Find queries by senderId and senderRole
    const queryDocs = await Query.find({
      senderId,
      senderRole
    })
      .populate("senderId", "firstName lastName role email")
      .populate("receiverId", "firstName lastName role email")
      .sort({ createdAt: -1 });

    if (!queryDocs || queryDocs.length === 0) {
      return res.status(200).json({ Message: "No queries found for this sender" });
    }

    return res.status(200).json({
      Message: "Queries fetched successfully",
      data: queryDocs,
    });
  } catch (err) {
    console.error("Error fetching queries:", err);
    return res.status(500).json({
      Message: "Internal server error",
      Error: err.message,
    });
  }
};




const adminqueryreply = async (req, res) => {
  const { queryId, senderid, senederrole, response } = req.body;

  try {
    if (!queryId || !senderid || !senederrole || !response) {
      return res.status(400).json({
        Message: "Missing required fields: queryId, senderid, senederrole, response",
      });
    }

    if (senederrole !== "Admin") {
      return res.status(403).json({
        Message: "Only Admins are allowed to send replies",
      });
    }

    const admin = await AdminRegister.findById(senderid);
    if (!admin) {
      return res.status(404).json({ Message: "Admin not found" });
    }

    const queryDoc = await Query.findById(queryId);
    if (!queryDoc) {
      return res.status(404).json({ Message: "Query not found" });
    }

    // ✅ Update nested fields inside `queries`
    queryDoc.queries.response = response;
    queryDoc.queries.status = "completed";
    queryDoc.queries.date = new Date();

    await queryDoc.save();

    return res.status(200).json({
      Message: "Admin response added successfully",
      data: queryDoc,
    });
  } catch (error) {
    console.error("Error in adminqueryreply:", error);
    res.status(500).json({
      Message: "Server error while replying to query",
      Error: error.message,
    });
  }
};









export default { querysend, queryreceive,adminqueryreply } 