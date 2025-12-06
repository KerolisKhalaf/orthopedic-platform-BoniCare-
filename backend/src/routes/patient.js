import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getPatientDashboard } from '../controllers/patientController.js';

const router = express.Router();

router.get('/dashboard', protect(['patient']), getPatientDashboard);

export default router;
