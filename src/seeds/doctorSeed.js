import DoctorProfile from '../models/DoctorProfile.js';
import { fakerInstance, log } from './helper.js';

export const seedDoctors = async (users) => {
  log('Seeding doctor profiles...');
  const doctors = users.filter(u => u.role === 'doctor');
  const doctorProfiles = [];

  for (const user of doctors) {
    const profile = new DoctorProfile({
      userId: user._id,
      specialty: fakerInstance.person.jobTitle(),
      bio: fakerInstance.lorem.paragraph(),
      licenseNumber: fakerInstance.string.alphanumeric(10),
      yearsOfExperience: fakerInstance.number.int({ min: 1, max: 40 }),
      hospitalInfo: fakerInstance.company.name()
    });
    doctorProfiles.push(await profile.save());
  }
  
  log('Doctor profiles seeded successfully.');
  return doctorProfiles;
};
