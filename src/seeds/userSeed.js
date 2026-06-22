import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { fakerInstance, log } from './helper.js';

const DEMO_USERS = [
  {
    name: 'Kerolis Patient',
    email: 'patient.kerolis@gmail.com',
    phone: '+201000000001',
    password: 'Patient@123456',
    role: 'patient',
  },
  {
    name: 'Dr. Ahmed Hassan',
    email: 'dr.ahmed@bonicare.com',
    phone: '+201000000002',
    password: 'Doctor@123456',
    role: 'doctor',
  },
  {
    name: 'BoniCare Admin',
    email: 'admin@bonicare.com',
    phone: '+201000000003',
    password: 'Admin@123456',
    role: 'admin',
  },
];

export const seedUsers = async (extraCount = 12) => {
  log('Seeding demo + additional users...');
  const users = [];

  for (const demo of DEMO_USERS) {
    const hash = await bcrypt.hash(demo.password, 10);
    const user = await User.findOneAndUpdate(
      { email: demo.email },
      {
        name: demo.name,
        email: demo.email,
        phone: demo.phone,
        passwordHash: hash,
        role: demo.role,
      },
      { upsert: true, new: true }
    );
    users.push(user);
    log(`Demo user ready: ${demo.role} -> ${demo.email}`);
  }

  for (let i = 0; i < extraCount; i++) {
    const role = i < 4 ? 'doctor' : 'patient';
    const email = fakerInstance.internet.email({ allowSpecialCharacters: false });
    const hash = await bcrypt.hash('Demo@123456', 10);
    const user = new User({
      name: fakerInstance.person.fullName(),
      email,
      phone: fakerInstance.phone.number(),
      passwordHash: hash,
      role,
    });
    users.push(await user.save());
  }

  log(`${users.length} users seeded successfully.`);
  return users;
};
