import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';
import DoctorAvailability from '../models/DoctorAvailability.js';
import { APPOINTMENT_STATUS } from '../config/constants.js';
import AppError from '../utils/AppError.js';

// Book a new appointment (Patient)
export const bookAppointment = async (req, res) => {
  const patientId = req.user.id;
  const { doctorId, scheduledDate, startTime, endTime, notes } = req.body;

  // Verify doctor exists and has a profile
  const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
  if (!doctor) throw new AppError('Doctor not found', 404);

  const newAppointment = new Appointment({
    patientId,
    doctorId,
    scheduledDate,
    startTime,
    endTime,
    notes,
    status: APPOINTMENT_STATUS.SCHEDULED
  });

  await newAppointment.save();
  return res.status(201).json({ success: true, data: newAppointment });
};

// Get patient's own appointments
export const getPatientAppointments = async (req, res) => {
  const patientId = req.user.id;
  const appointments = await Appointment.find({ patientId })
    .populate('doctorId', 'name email')
    .sort({ scheduledDate: 1, startTime: 1 })
    .lean();

  return res.status(200).json({ success: true, data: appointments });
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const { id } = req.params;

  const query = { _id: id };
  if (userRole === 'patient') {
    query.patientId = userId;
  } else if (userRole === 'doctor') {
    query.doctorId = userId;
  }

  const appointment = await Appointment.findOne(query);
  if (!appointment) throw new AppError('Appointment not found or not authorized', 404);

  if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
    throw new AppError('Appointment is already cancelled', 400);
  }

  appointment.status = APPOINTMENT_STATUS.CANCELLED;
  await appointment.save();

  return res.status(200).json({ success: true, message: 'Appointment cancelled successfully', data: appointment });
};

// List all doctors (for patients to browse)
export const getDoctors = async (req, res) => {
  const doctors = await DoctorProfile.find()
    .populate('userId', 'name email')
    .lean();
  return res.status(200).json({ success: true, data: doctors });
};

// Get specific doctor's availability (for booking)
export const getDoctorAvailabilityForBooking = async (req, res) => {
  const { doctorId } = req.params;
  const profile = await DoctorProfile.findOne({ userId: doctorId });
  if (!profile) throw new AppError('Doctor profile not found', 404);

  const availability = await DoctorAvailability.find({ doctorProfileId: profile._id, isActive: true }).lean();
  return res.status(200).json({ success: true, data: availability });
};
