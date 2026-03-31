import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';
import DoctorAvailability from '../models/DoctorAvailability.js';
import { APPOINTMENT_STATUS } from '../config/constants.js';

// Book a new appointment (Patient)
export const bookAppointment = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { doctorId, scheduledDate, startTime, endTime, notes } = req.body;

    // Verify doctor exists and has a profile
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

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
    return res.status(201).json(newAppointment);
  } catch (err) {
    console.error(err);
    if (err.message.includes('Overlap')) {
      return res.status(400).json({ message: 'Overlapping appointment detected for this doctor.' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get patient's own appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;
    const appointments = await Appointment.find({ patientId })
      .populate('doctorId', 'name email')
      .sort({ scheduledDate: 1, startTime: 1 })
      .lean();

    return res.json(appointments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
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
    if (!appointment) return res.status(404).json({ message: 'Appointment not found or not authorized' });

    if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    appointment.status = APPOINTMENT_STATUS.CANCELLED;
    await appointment.save();

    return res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List all doctors (for patients to browse)
export const getDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find()
      .populate('userId', 'name email')
      .lean();
    return res.json(doctors);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get specific doctor's availability (for booking)
export const getDoctorAvailabilityForBooking = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const profile = await DoctorProfile.findOne({ userId: doctorId });
    if (!profile) return res.status(404).json({ message: 'Doctor profile not found' });

    const availability = await DoctorAvailability.find({ doctorProfileId: profile._id, isActive: true }).lean();
    return res.json(availability);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
