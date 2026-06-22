import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { fakerInstance, log } from './helper.js';

export const seedAppointments = async (patients, doctors) => {
  log('Seeding appointments...');
  const appointments = [];

  const demoPatientUser = await User.findOne({ email: 'patient.kerolis@gmail.com' });
  const demoDoctorProfile = doctors.find((d) => d.licenseNumber === 'EG-ORTH-001') ?? doctors[0];

  if (demoPatientUser && demoDoctorProfile) {
    const now = new Date();
    const demoSlots = [
      { days: 2, hour: 10, status: 'scheduled' },
      { days: 5, hour: 14, status: 'awaiting_payment' },
      { days: -3, hour: 11, status: 'completed' },
    ];

    for (const slot of demoSlots) {
      const start = new Date(now);
      start.setDate(start.getDate() + slot.days);
      start.setHours(slot.hour, 0, 0, 0);
      const end = new Date(start.getTime() + 30 * 60000);

      appointments.push(
        await new Appointment({
          patientId: demoPatientUser._id,
          doctorId: demoDoctorProfile.userId,
          scheduledDate: start,
          startTime: start,
          endTime: end,
          status: slot.status,
          notes: 'Demo appointment — Low back pain follow-up (ICD-10: M54.5)',
        }).save()
      );
    }
    log('Demo patient/doctor appointments created.');
  }

  for (let i = 0; i < 12; i++) {
    const patient = fakerInstance.helpers.arrayElement(patients);
    const doctor = fakerInstance.helpers.arrayElement(doctors);
    const startTime = fakerInstance.date.future();
    const endTime = new Date(startTime.getTime() + 30 * 60000);

    appointments.push(
      await new Appointment({
        patientId: patient.user,
        doctorId: doctor.userId,
        scheduledDate: startTime,
        startTime,
        endTime,
        status: 'scheduled',
        notes: 'ICD-10: M54.5 (Low back pain)',
      }).save()
    );
  }

  log(`${appointments.length} appointments seeded successfully.`);
  return appointments;
};
