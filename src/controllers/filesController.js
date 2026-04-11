// src/controllers/filesController.js
import fs from "node:fs";
import path from "node:path";
import AppError from "../utils/AppError.js";

// folder where uploads are saved
const uploadDir = path.join(process.cwd(), "uploads");

/**
 * @openapi
 * /files:
 *   post:
 *     tags: [Files]
 *     summary: Upload a medical file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *   get:
 *     tags: [Files]
 *     summary: Get all uploaded files
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
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

/**
 * @openapi
 * /files/{filename}:
 *   get:
 *     tags: [Files]
 *     summary: Get a file by name
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: File content
 *   delete:
 *     tags: [Files]
 *     summary: Delete a file by name
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
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
