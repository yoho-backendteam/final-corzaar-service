import Query from "../../models/Query/query_schema.js"
import { queryValidationSchema, queryReceiveSchema } from "../../validation/Query/query.js";
import axios from "axios";

const querysend = async (req, res) => {
  const { senderId, senderRole, query } = req.body;

  try {
    const newQuery = new Query({
      senderId, 
      senderRole,
      queries: {
        senderRole,
        query,
      },
    });

    await newQuery.save();

    return res.status(200).json({
      Message: "Query saved successfully",
      data: newQuery,
    });

  } catch (error) {
    return res.status(500).json({
      Message: "Error: " + error.message,
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
  const{queryId} = req.params
  const {  response } = req.body;

  try {
    if (!response) {
      return res.status(400).json({
        Message: "Missing required fields: response",
      });
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

const adminReceiveQueries = async (req, res) => {
  try {
    // Fetch all queries
    const queries = await Query.find()

    const queriesWithInstitute = await Promise.all(
      queries.map(async (q) => {
        let instituteName = "N/A";

        // safely get senderId from nested queries object if it exists
        const senderId = q?.senderId;
        if (senderId) {
          try {
            const courseResponse = await axios.get(`http://localhost:3002/api/getforcourse/${senderId}`);
            instituteName = courseResponse.data?.data?.name || "N/A";
          } catch (err) {
            console.error(`Error fetching course ${senderId}:`, err.message);
          }
        }

        return {
          ...q._doc, // include all query fields
          instituteName,
        };
      })
    );

    return res.status(200).json({
      Message: "Queries fetched successfully with institute names",
      data: queriesWithInstitute,
    });
  } catch (error) {
    console.error("Error fetching queries:", error.message);
    return res.status(500).json({
      Message: "Error fetching queries",
      Error: error.message,
    });
  }
};
const markQueryResolved = async (req,res) => {
  const { queryId } = req.params;

  if (!queryId) {
    return res.status(400).json({ Message: "Query ID is required" });
  }

  try {
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ Message: "Query not found" });
    }

    // Update status to Resolved
    query.queries.status = "completed";

    // Optionally, you can store admin response if needed
    // query.queries.response = req.body.response || query.queries.response;

    await query.save();

    return res.status(200).json({
      Message: "Query marked as resolved",
      data: query,
      Status: "Success",
    });
  } catch (error) {
    console.error("Error resolving query:", error);
    return res.status(500).json({
      Message: "Error resolving query",
      Error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};













export default { querysend, queryreceive,adminqueryreply,adminReceiveQueries,markQueryResolved } 