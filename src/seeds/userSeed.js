import User from '../models/User.js';
import { fakerInstance, log } from './helper.js';

export const seedUsers = async (count = 15) => {
  log(`Seeding ${count} users...`);
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const role = i < 5 ? 'doctor' : 'patient';
    const user = new User({
      name: fakerInstance.person.fullName(),
      email: fakerInstance.internet.email({ allowSpecialCharacters: false }),
      phone: fakerInstance.phone.number(),
      passwordHash: '$2b$10$abcdefghijklmnopqrstuv', // Mock hash
      role
    });
    users.push(await user.save());
  }
  
  log('Users seeded successfully.');
  return users;
};
