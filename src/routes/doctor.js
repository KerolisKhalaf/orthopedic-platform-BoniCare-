import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/errorHandler.js';
import { updateProfileValidator, availabilityValidator } from '../validators/doctorValidators.js';
import {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAvailability,
  addDoctorAvailability,
  deleteDoctorAvailability,
  getDoctorAppointments
} from '../controllers/doctorController.js';

const router = express.Router();

// All doctor routes are protected and require 'doctor' role
router.use(protect(['doctor']));

router.get('/profile', getDoctorProfile);
router.put('/profile', updateProfileValidator, validate, updateDoctorProfile);
router.get('/availability', getDoctorAvailability);
router.post('/availability', availabilityValidator, validate, addDoctorAvailability);
router.delete('/availability/:id', deleteDoctorAvailability);
router.get('/appointments', getDoctorAppointments);

export default router;
