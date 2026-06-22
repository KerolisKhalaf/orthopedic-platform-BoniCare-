import DoctorProfile from '../models/DoctorProfile.js';
import { fakerInstance, log } from './helper.js';

const DEMO_DOCTOR_PROFILES = {
  'dr.ahmed@bonicare.com': {
    specialty: 'Orthopedic Surgery',
    bio: 'Specialist in spine and joint disorders with 15+ years of clinical experience.',
    licenseNumber: 'EG-ORTH-001',
    yearsOfExperience: 15,
    hospitalInfo: 'Cairo University Hospital',
  },
};

export const seedDoctors = async (users) => {
  log('Seeding doctor profiles...');
  const doctors = users.filter((u) => u.role === 'doctor');
  const doctorProfiles = [];

  for (const user of doctors) {
    const demo = DEMO_DOCTOR_PROFILES[user.email];
    const profile = await DoctorProfile.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        specialty: demo?.specialty ?? fakerInstance.person.jobTitle(),
        bio: demo?.bio ?? fakerInstance.lorem.paragraph(),
        licenseNumber: demo?.licenseNumber ?? `LIC-${fakerInstance.string.alphanumeric(8)}`,
        yearsOfExperience: demo?.yearsOfExperience ?? fakerInstance.number.int({ min: 1, max: 40 }),
        hospitalInfo: demo?.hospitalInfo ?? fakerInstance.company.name(),
      },
      { upsert: true, new: true, runValidators: true }
    );
    doctorProfiles.push(profile);
  }

  log('Doctor profiles seeded successfully.');
  return doctorProfiles;
};
