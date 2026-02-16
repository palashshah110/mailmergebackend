import nodemailer from "nodemailer";
import { parseExcel } from "./excel.service.js";

import dotenv from "dotenv";
dotenv.config();

export const jobProgress = {};

/**
 * SMTP transporter
 */
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send bulk emails with progress tracking
 */
export const sendBulkMail = async (req, res) => {
  try {
    const { subject = "", html = "" } = req.body;

    const excelFile = req.files?.excel?.[0];
    const pdfFile = req.files?.pdf?.[0];

    if (!excelFile) {
      return res.status(400).json({ error: "Excel file is required" });
    }

    // Parse excel
    const { validUsers, invalidUsers } = parseExcel(excelFile.path);

    if (validUsers.length === 0) {
      return res.status(400).json({
        error: "No valid email records found",
        invalidEmails: invalidUsers.length
      });
    }

    // Create Job ID
    const jobId = Date.now().toString();

    jobProgress[jobId] = {
      status: "running",
      total: validUsers.length,
      sent: 0,
      failed: 0,
      invalid: invalidUsers.length
    };

    // Respond immediately so UI can start polling
    res.json({ jobId });

    // Start sending emails asynchronously
    for (const user of validUsers) {
      try {
        // Replace ALL {{variables}} dynamically
        const finalHtml = html.replace(/\{\{(\w+)\}\}/g, (_, key) =>
          user[key] !== undefined ? user[key] : ""
        );

        const finalSubject = subject.replace(/\{\{(\w+)\}\}/g, (_, key) =>
          user[key] !== undefined ? user[key] : ""
        );

        await transporter.sendMail({
          from: `"Learning Links India" <${process.env.EMAIL}>`,
          to: user.email,
          subject: finalSubject,
          html: finalHtml,
          attachments: pdfFile
            ? [
                {
                  filename: pdfFile.originalname,
                  path: pdfFile.path
                }
              ]
            : []
        });

        jobProgress[jobId].sent++;
      } catch (mailErr) {
        console.error("❌ Mail failed:", mailErr.message);
        jobProgress[jobId].failed++;
      }
    }

    jobProgress[jobId].status = "done";
  } catch (err) {
    console.error("❌ Bulk mail error:", err);
    res.status(500).json({ error: "Failed to process bulk email" });
  }
};
