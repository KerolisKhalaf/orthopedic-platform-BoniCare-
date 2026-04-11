import Patient from '../models/patient.js';
import { fakerInstance, log } from './helper.js';

export const seedPatients = async (users) => {
  log('Seeding patient profiles...');
  const patients = users.filter(u => u.role === 'patient');
  const patientProfiles = [];

  for (const user of patients) {
    const patient = new Patient({
      user: user._id,
      dob: fakerInstance.date.birthdate(),
      gender: fakerInstance.helpers.arrayElement(['male', 'female', 'other']),
      medical_history: {
        diagnosis: "E11.9", // Example ICD-10 code
        notes: "Type 2 diabetes mellitus without complications"
      }
    });
    patientProfiles.push(await patient.save());
  }
  
  log('Patient profiles seeded successfully.');
  return patientProfiles;
};
