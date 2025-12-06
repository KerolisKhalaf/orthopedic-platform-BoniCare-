// src/controllers/filesController.js
import fs from "fs";
import path from "path";

// folder where uploads are saved
const uploadDir = path.join(process.cwd(), "uploads");

// Upload a medical file
export const uploadMedicalFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // هنا ممكن تضيف حفظ بيانات الملف في قاعدة البيانات لو محتاج
    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all uploaded files
export const getAllFiles = async (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir).map((file) => ({
      filename: file,
      path: path.join(uploadDir, file),
    }));

    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single file by filename
export const getFileByName = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a file by filename
export const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    fs.unlinkSync(filePath);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
