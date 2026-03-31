import DoctorProfile from '../models/DoctorProfile.js';
import DoctorAvailability from '../models/DoctorAvailability.js';
import Appointment from '../models/Appointment.js';

// Get current doctor's profile
export const getDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await DoctorProfile.findOne({ userId }).lean();
    if (!profile) return res.status(404).json({ message: 'Doctor profile not found' });
    return res.json(profile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create or update doctor's profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { specialty, bio, licenseNumber, yearsOfExperience, hospitalInfo } = req.body;

    const profile = await DoctorProfile.findOneAndUpdate(
      { userId },
      { specialty, bio, licenseNumber, yearsOfExperience, hospitalInfo },
      { new: true, upsert: true, runValidators: true }
    );

    return res.json(profile);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get current doctor's availability
export const getDoctorAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await DoctorProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Doctor profile not found' });

    const availability = await DoctorAvailability.find({ doctorProfileId: profile._id }).lean();
    return res.json(availability);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add a new availability slot
export const addDoctorAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await DoctorProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Doctor profile not found' });

    const { dayOfWeek, startTime, endTime } = req.body;
    const availability = new DoctorAvailability({
      doctorProfileId: profile._id,
      dayOfWeek,
      startTime,
      endTime
    });

    await availability.save();
    return res.status(201).json(availability);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete an availability slot
export const deleteDoctorAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const profile = await DoctorProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: 'Doctor profile not found' });

    const result = await DoctorAvailability.findOneAndDelete({
      _id: id,
      doctorProfileId: profile._id
    });

    if (!result) return res.status(404).json({ message: 'Availability slot not found or not owned by you' });

    return res.json({ message: 'Availability slot deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get doctor's appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.find({ doctorId: userId })
      .populate('patientId', 'name email')
      .sort({ scheduledDate: 1, startTime: 1 })
      .lean();

    return res.json(appointments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
