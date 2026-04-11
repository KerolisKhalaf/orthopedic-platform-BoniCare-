import DoctorProfile from '../models/DoctorProfile.js';
import DoctorAvailability from '../models/DoctorAvailability.js';
import Appointment from '../models/Appointment.js';
import AppError from '../utils/AppError.js';

// Get current doctor's profile
/**
 * @openapi
 * /doctor/profile:
 *   get:
 *     tags: [Doctors]
 *     summary: Get current doctor profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   put:
 *     tags: [Doctors]
 *     summary: Update current doctor profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
export const getDoctorProfile = async (req, res) => {
  const userId = req.user.id;
  const profile = await DoctorProfile.findOne({ userId }).lean();
  if (!profile) throw new AppError('Doctor profile not found', 404);
  return res.status(200).json({ success: true, data: profile });
};

// Create or update doctor's profile
export const updateDoctorProfile = async (req, res) => {
  const userId = req.user.id;
  const { specialty, bio, licenseNumber, yearsOfExperience, hospitalInfo } = req.body;

  const profile = await DoctorProfile.findOneAndUpdate(
    { userId },
    { specialty, bio, licenseNumber, yearsOfExperience, hospitalInfo },
    { new: true, upsert: true, runValidators: true }
  );

  return res.status(200).json({ success: true, data: profile });
};

/**
 * @openapi
 * /doctor/availability:
 *   get:
 *     tags: [Doctors]
 *     summary: Get doctor availability
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     tags: [Doctors]
 *     summary: Add availability slot
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 */
export const getDoctorAvailability = async (req, res) => {
  const userId = req.user.id;
  const profile = await DoctorProfile.findOne({ userId });
  if (!profile) throw new AppError('Doctor profile not found', 404);

  const availability = await DoctorAvailability.find({ doctorProfileId: profile._id }).lean();
  return res.status(200).json({ success: true, data: availability });
};

// Add a new availability slot
export const addDoctorAvailability = async (req, res) => {
  const userId = req.user.id;
  const profile = await DoctorProfile.findOne({ userId });
  if (!profile) throw new AppError('Doctor profile not found', 404);

  const { dayOfWeek, startTime, endTime } = req.body;
  const availability = new DoctorAvailability({
    doctorProfileId: profile._id,
    dayOfWeek,
    startTime,
    endTime
  });

  await availability.save();
  return res.status(201).json({ success: true, data: availability });
};

/**
 * @openapi
 * /doctor/availability/{id}:
 *   delete:
 *     tags: [Doctors]
 *     summary: Delete availability slot
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
export const deleteDoctorAvailability = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const profile = await DoctorProfile.findOne({ userId });
  if (!profile) throw new AppError('Doctor profile not found', 404);

  const result = await DoctorAvailability.findOneAndDelete({
    _id: id,
    doctorProfileId: profile._id
  });

  if (!result) throw new AppError('Availability slot not found or not owned by you', 404);

  return res.status(200).json({ success: true, message: 'Availability slot deleted successfully' });
};

/**
 * @openapi
 * /doctor/appointments:
 *   get:
 *     tags: [Doctors]
 *     summary: Get doctor appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
export const getDoctorAppointments = async (req, res) => {
  const userId = req.user.id;
  const appointments = await Appointment.find({ doctorId: userId })
    .populate('patientId', 'name email')
    .sort({ scheduledDate: 1, startTime: 1 })
    .lean();

  return res.status(200).json({ success: true, data: appointments });
};
