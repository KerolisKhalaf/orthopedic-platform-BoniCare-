import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import MedicalFile from '../models/medicalFile.js';
import Patient from '../models/patient.js';

const router = express.Router();

// single file upload field name: 'file'
router.post('/upload', protect(['patient','doctor','admin']), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // get or create patient profile for user (for doctors, you might accept patientId in body)
    let patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      // create profile skeleton if not exists
      patient = await Patient.create({ user: req.user.id });
    }

    const fileDoc = await MedicalFile.create({
      patient: patient._id,
      uploader: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      modality: req.body.modality || 'unknown',
      part: req.body.part || 'unknown'
    });

    // TODO: enqueue a job for image analysis (AI service) to process this file.
    // e.g. publish to RabbitMQ / push to SQS / call AI microservice

    return res.status(201).json({ message: 'File uploaded', file: fileDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;
