import Patient from '../models/patient.js';
import User from '../models/User.js';
import MedicalFile from '../models/medicalFile.js'; 
import AiReport from '../models/AiReport.js'; 
import AppError from '../utils/AppError.js';

/**
 * @openapi
 * /patient/dashboard:
 *   get:
 *     tags: [Patients]
 *     summary: Get patient dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Patient profile not found
 */
export const getPatientDashboard = async (req, res) => {
  // req.user coming from auth middleware (id, role)
  const userId = req.user.id;
  const patient = await Patient.findOne({ user: userId }).lean();
  
  if (!patient) {
    throw new AppError('Patient profile not found', 404);
  }

  // الآن نجلب ملفات المريض، التقارير، المواعيد (نماذج بسيطة)
  const files = await MedicalFile.find({ patient: patient._id }).sort({ uploadedAt: -1 }).lean();
  const ai_reports = await AiReport.find({ patient: patient._id }).sort({ createdAt: -1 }).lean();
  const appointments = []; 

  return res.json({
    success: true,
    patient,
    files,
    ai_reports,
    appointments
  });
};
