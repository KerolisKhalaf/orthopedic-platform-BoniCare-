import Patient from '../models/patient.js';
import { fakerInstance, log } from './helper.js';

const DEMO_PATIENT_PROFILES = {
  'patient.kerolis@gmail.com': {
    gender: 'male',
    medical_history: {
      diagnosis: 'M54.5',
      notes: 'Low back pain — initial orthopedic assessment',
      allergies: ['Penicillin'],
    },
  },
};

export const seedPatients = async (users) => {
  log('Seeding patient profiles...');
  const patients = users.filter((u) => u.role === 'patient');
  const patientProfiles = [];

  for (const user of patients) {
    const demo = DEMO_PATIENT_PROFILES[user.email];
    const patient = await Patient.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        dob: demo ? new Date('1998-05-15') : fakerInstance.date.birthdate(),
        gender: demo?.gender ?? fakerInstance.helpers.arrayElement(['male', 'female', 'other']),
        medical_history: demo?.medical_history ?? {
          diagnosis: 'E11.9',
          notes: 'Type 2 diabetes mellitus without complications',
        },
      },
      { upsert: true, new: true }
    );
    patientProfiles.push(patient);
  }

  log('Patient profiles seeded successfully.');
  return patientProfiles;
};
