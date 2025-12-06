import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { fileUploadValidator } from "../validators/fileValidators.js";
import { validate } from "../middleware/errorHandler.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadMedicalFile } from "../controllers/filesController.js";

const router = express.Router();

router.post(
  "/upload",
  protect(["patient"]),
  upload.single("file"),
  fileUploadValidator,
  validate,
  uploadMedicalFile
);

export default router;
