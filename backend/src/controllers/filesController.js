// src/controllers/filesController.js
import fs from "node:fs";
import path from "node:path";
import AppError from "../utils/AppError.js";

// folder where uploads are saved
const uploadDir = path.join(process.cwd(), "uploads");

// Upload a medical file
export const uploadMedicalFile = async (req, res) => {
  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

  return res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    data: {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
};

// Get all uploaded files
export const getAllFiles = async (req, res) => {
  const files = fs.readdirSync(uploadDir).map((file) => ({
    filename: file,
    path: path.join(uploadDir, file),
  }));

  return res.status(200).json({ success: true, data: files });
};

// Get a single file by filename
export const getFileByName = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    throw new AppError("File not found", 404);
  }

  return res.sendFile(filePath);
};

// Delete a file by filename
export const deleteFile = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    throw new AppError("File not found", 404);
  }

  fs.unlinkSync(filePath);
  return res.status(200).json({ success: true, message: "File deleted successfully" });
};
