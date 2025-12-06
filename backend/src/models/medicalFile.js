import mongoose from 'mongoose';

const medicalFileSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  path: String,
  modality: String, // X-ray, MRI, CT...
  part: String, // knee, shoulder...
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('MedicalFile', medicalFileSchema);
