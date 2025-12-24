import express from "express";
import multer from "multer";
import { sendBulkMail } from "../services/mail.service.js";
import { parseExcel } from "../services/excel.service.js";
import { jobProgress } from "../services/mail.service.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post(
  "/send",
  upload.fields([
    { name: "excel", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]),
  sendBulkMail
);
router.get("/status/:jobId", (req, res) => {
  res.json(jobProgress[req.params.jobId] || {});
});

router.post(
  "/preview-columns",
  upload.single("excel"),
  (req, res) => {
    const { columns } = parseExcel(req.file.path);
    res.json({ columns });
  }
);

export default router;
