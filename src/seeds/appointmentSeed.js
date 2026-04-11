import Appointment from '../models/Appointment.js';
import { fakerInstance, log } from './helper.js';

export const seedAppointments = async (patients, doctors) => {
  log('Seeding appointments...');
  const appointments = [];

  for (let i = 0; i < 15; i++) {
    const patient = fakerInstance.helpers.arrayElement(patients);
    const doctor = fakerInstance.helpers.arrayElement(doctors);
    const startTime = fakerInstance.date.future();
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 mins

    const appointment = new Appointment({
      patientId: patient.user,
      doctorId: doctor.userId,
      scheduledDate: startTime,
      startTime,
      endTime,
      status: 'scheduled',
      notes: "ICD-10: M54.5 (Low back pain)"
    });
    appointments.push(await appointment.save());
  }
  
  log('Appointments seeded successfully.');
  return appointments;
};
