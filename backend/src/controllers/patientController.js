import Patient from '../models/patient.js';
import User from '../models/User.js';
import MedicalFile from '../models/medicalFile.js'; // نعرف موديل files أدناه
import AiReport from '../models/AiReport.js'; // موديل افتراضي

export const getPatientDashboard = async (req, res) => {
  try {
    // req.user coming from auth middleware (id, role)
    const userId = req.user.id;
    const patient = await Patient.findOne({ user: userId }).lean();
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    // الآن نجلب ملفات المريض، التقارير، المواعيد (نماذج بسيطة)
    const files = await MedicalFile.find({ patient: patient._id }).sort({ uploadedAt: -1 }).lean();
    const ai_reports = await AiReport.find({ patient: patient._id }).sort({ createdAt: -1 }).lean();
    const appointments = []; // لو لسا ماعملتش جدول appointments، رجع مصفوفة فارغة

    return res.json({
      patient,
      files,
      ai_reports,
      appointments
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
