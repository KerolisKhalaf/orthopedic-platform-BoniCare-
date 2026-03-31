import * as dbHandler from '../utils/dbHandler.js';
import DoctorAvailability from '../../src/models/DoctorAvailability.js';
import DoctorProfile from '../../src/models/DoctorProfile.js';
import User from '../../src/models/User.js';
import mongoose from 'mongoose';

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('DoctorAvailability Model', () => {
  it('should save availability with valid HH:mm format', async () => {
    const doctorUser = new User({ name: 'Dr. Smith', email: 'smith@ex.com', passwordHash: 'password123', role: 'doctor' });
    const savedUser = await doctorUser.save();
    const profile = new DoctorProfile({ userId: savedUser._id, specialty: 'X', bio: 'Y', licenseNumber: 'L1', yearsOfExperience: 5 });
    const savedProfile = await profile.save();

    const availability = new DoctorAvailability({
      doctorProfileId: savedProfile._id,
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '17:00'
    });
    const savedAvail = await availability.save();
    expect(savedAvail._id).toBeDefined();
  });

  it('should fail if time format is invalid', async () => {
    const availability = new DoctorAvailability({
      doctorProfileId: new mongoose.Types.ObjectId(),
      dayOfWeek: 'Monday',
      startTime: '9:00', // Invalid, should be 09:00
      endTime: '17:00'
    });
    let err;
    try { await availability.save(); } catch (e) { err = e; }
    expect(err).toBeDefined();
  });
});