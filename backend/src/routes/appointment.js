import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/errorHandler.js';
import { bookAppointmentValidator, cancelAppointmentValidator } from '../validators/appointmentValidators.js';
import {
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
  getDoctors,
  getDoctorAvailabilityForBooking
} from '../controllers/appointmentController.js';

const router = express.Router();

// Get doctors list and availability (Can be accessed by patient/admin, maybe public)
router.get('/doctors', protect(['patient', 'admin']), getDoctors);
router.get('/doctors/:doctorId/availability', protect(['patient', 'admin']), getDoctorAvailabilityForBooking);

// Patient specific routes
router.post('/book', protect(['patient']), bookAppointmentValidator, validate, bookAppointment);
router.get('/my-appointments', protect(['patient']), getPatientAppointments);

// Shared cancel route
router.put('/:id/cancel', protect(['patient', 'doctor', 'admin']), cancelAppointmentValidator, validate, cancelAppointment);

export default router;
