import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';
import DoctorAvailability from '../models/DoctorAvailability.js';
import { APPOINTMENT_STATUS } from '../config/constants.js';
import AppError from '../utils/AppError.js';

/**
 * @openapi
 * /appointment:
 *   post:
 *     tags: [Appointments]
 *     summary: Book an appointment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 *   get:
 *     tags: [Appointments]
 *     summary: Get patient appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
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

/**
 * @openapi
 * /appointment/{id}/cancel:
 *   put:
 *     tags: [Appointments]
 *     summary: Cancel appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Cancelled successfully
 */
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

/**
 * @openapi
 * /appointment/doctors:
 *   get:
 *     tags: [Appointments]
 *     summary: List all doctors
 *     responses:
 *       200:
 *         description: Success
 */
// List all doctors (for patients to browse)
export const getDoctors = async (req, res) => {
  const doctors = await DoctorProfile.find()
    .populate('userId', 'name email')
    .lean();
  return res.status(200).json({ success: true, data: doctors });
};

/**
 * @openapi
 * /appointment/doctor/{doctorId}/availability:
 *   get:
 *     tags: [Appointments]
 *     summary: Get doctor availability for booking
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
// Get specific doctor's availability (for booking)
export const getDoctorAvailabilityForBooking = async (req, res) => {
  const { doctorId } = req.params;
  const profile = await DoctorProfile.findOne({ userId: doctorId });
  if (!profile) throw new AppError('Doctor profile not found', 404);

  const availability = await DoctorAvailability.find({ doctorProfileId: profile._id, isActive: true }).lean();
  return res.status(200).json({ success: true, data: availability });
};
