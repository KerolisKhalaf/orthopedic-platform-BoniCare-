import * as dbHandler from '../utils/dbHandler.js';
import DoctorProfile from '../../src/models/DoctorProfile.js';
import User from '../../src/models/User.js';
import mongoose from 'mongoose';

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('DoctorProfile Model', () => {
  it('should create & save doctor profile successfully', async () => {
    const doctorUser = new User({
      name: 'Dr. Smith',
      email: 'smith@example.com',
      passwordHash: 'password123',
      role: 'doctor'
    });
    const savedUser = await doctorUser.save();

    const validDoctorProfile = new DoctorProfile({
      userId: savedUser._id,
      specialty: 'Orthopedist',
      bio: 'Expert in joint replacement',
      licenseNumber: 'DOC12345',
      yearsOfExperience: 10
    });
    const savedProfile = await validDoctorProfile.save();
    
    expect(savedProfile._id).toBeDefined();
    expect(savedProfile.specialty).toBe('Orthopedist');
  });

  it('should fail if user has incorrect role', async () => {
    const patientUser = new User({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: 'password123',
      role: 'patient'
    });
    const savedUser = await patientUser.save();

    const invalidProfile = new DoctorProfile({
      userId: savedUser._id,
      specialty: 'Orthopedist',
      bio: 'Expert in joint replacement',
      licenseNumber: 'DOC12345',
      yearsOfExperience: 10
    });

    let err;
    try {
      await invalidProfile.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.userId.message).toBe("User must have a 'doctor' role!");
  });

  it('should fail if required fields are missing', async () => {
    const profileWithoutRequired = new DoctorProfile({ specialty: 'Orthopedist' });
    let err;
    try {
      await profileWithoutRequired.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});