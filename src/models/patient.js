import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  medical_history: { type: Object, default: {} }, // يمكن تخزين JSON مرن
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Patient', patientSchema);
