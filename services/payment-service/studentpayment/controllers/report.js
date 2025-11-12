// controllers/reportController.js
import PDFDocument from "pdfkit";
import moment from "moment";
import mongoose from "mongoose";
import PaymentTransaction from "../models/index.js";
import { successResponse, errorResponse } from "../utils/index.js";

export const generateFinancialReport = async (req, res) => {
  try {
    const { type = "monthly", instituteId, downloadName } = req.query;

    let start, end;
    const now = moment();

    // Determine report range
    switch (type.toLowerCase()) {
      case "daily":
        start = now.clone().startOf("day");
        end = now.clone().endOf("day");
        break;
      case "monthly":
        start = now.clone().startOf("month");
        end = now.clone().endOf("month");
        break;
      case "yearly":
        start = now.clone().startOf("year");
        end = now.clone().endOf("year");
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid report type" });
    }

    // Match filter
    const match = { isdeleted: false, createdAt: { $gte: start.toDate(), $lte: end.toDate() } };
    if (instituteId) {
      if (!mongoose.Types.ObjectId.isValid(instituteId))
        return res.status(400).json({ success: false, message: "Invalid instituteId" });
      match.instituteId = new mongoose.Types.ObjectId(instituteId);
    }

    // MongoDB aggregation
    const pipeline = [
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 },
              },
            },
          ],
          transactions: [
            {
              $project: {
                transactionId: 1,
                studentName: 1, // ✅ Include student name
                paymentMethod: 1,
                status: 1,
                type: 1,
                amount: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ];

    const [agg] = await PaymentTransaction.aggregate(pipeline);
    const totals = agg?.totals?.[0] || { totalAmount: 0, count: 0 };
    const txns = agg?.transactions || [];

    // ======= CREATE PDF =======
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    const filename = downloadName || `financial-report-${type}-${moment().format("YYYYMMDD")}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    doc.pipe(res);

    // ======= HEADER =======
    doc.fontSize(18).text("Financial Report", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Report Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (instituteId) doc.text(`Institute ID: ${instituteId}`);
    doc.text(`Period: ${start.format("YYYY-MM-DD")} → ${end.format("YYYY-MM-DD")}`);
    doc.text(`Generated At: ${moment().format("YYYY-MM-DD HH:mm:ss")}`);
    doc.moveDown();

    // ======= SUMMARY =======
    doc.fontSize(12).text("Summary", { underline: true });
    doc.moveDown(0.2);
    doc.fontSize(10);
    doc.text(`Total Transactions: ${totals.count}`);
    doc.text(`Total Amount: ₹${totals.totalAmount.toFixed(2)}`);
    doc.moveDown(1);

    // ======= TABLE =======
    doc.fontSize(14).text("Transactions", { underline: true });
    doc.moveDown(0.5);

    // Table header
    const headers = ["Student Name", "Payment Method", "Status", "Type", "Amount", "Date"];
    const colWidths = [120, 90, 80, 70, 70, 100];
    const startX = doc.x;
    let y = doc.y;

    doc.fontSize(10).fillColor("black");
    headers.forEach((header, i) => {
      doc.text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, { width: colWidths[i], align: "left" });
    });
    y += 20;
    doc.moveTo(startX, y - 5).lineTo(startX + colWidths.reduce((a, b) => a + b, 0), y - 5).stroke();

    // Rows
    txns.slice(0, 50).forEach((t) => {
      const row = [
        t.studentName || "-", // ✅ Display student name
        t.paymentMethod,
        t.status,
        t.type,
        "₹" + (t.amount || 0).toFixed(2),
        moment(t.createdAt).format("DD-MM-YYYY"),
      ];
      row.forEach((cell, i) => {
        doc.text(cell, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
          width: colWidths[i],
          align: "left",
        });
      });
      y += 18;
      if (y > 750) {
        doc.addPage();
        y = 60;
      }
    });

    doc.end();
  } catch (error) {

    return errorResponse(res, error.message || "Error generating report");
  }
};
