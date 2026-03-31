import mongoose from 'mongoose';
import { APPOINTMENT_STATUS } from '../config/constants.js';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(APPOINTMENT_STATUS),
    default: APPOINTMENT_STATUS.SCHEDULED,
    required: true
  },
  notes: {
    type: String
  }
}, { timestamps: true });

appointmentSchema.pre('save', async function(next) {
  const Appointment = mongoose.model('Appointment');
  
  // Find overlapping appointments for the same doctor
  const overlap = await Appointment.findOne({
    doctorId: this.doctorId,
    status: APPOINTMENT_STATUS.SCHEDULED,
    _id: { $ne: this._id },
    $or: [
      { startTime: { $lt: this.endTime }, endTime: { $gt: this.startTime } }
    ]
  });

  if (overlap) {
    throw new Error('Overlapping appointment detected for this doctor.');
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;