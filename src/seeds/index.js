import mongoose from 'mongoose';
import 'dotenv/config';
import { log } from './helper.js';
import { seedUsers } from './userSeed.js';
import { seedPatients } from './patientSeed.js';
import { seedDoctors } from './doctorSeed.js';
import { seedAppointments } from './appointmentSeed.js';
import { seedSupporting } from './supportingSeed.js';

const runSeed = async () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seeding is disabled in production');
  }

  const isReset = process.argv.includes('--reset');

  try {
    log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    log('Database connected successfully.');

    if (isReset) {
      log('Clearing collections...');
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany();
      }
      log('Collections cleared.');
    }

    const users = await seedUsers();
    const patients = await seedPatients(users);
    const doctors = await seedDoctors(users);
    await seedAppointments(patients, doctors);
    await seedSupporting(patients);

    log('Seeding completed successfully.');
  } catch (error) {
    log(`Seeding failed: ${error.message}`, 'error');
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    log('Database disconnected.');
  }
};

runSeed();
