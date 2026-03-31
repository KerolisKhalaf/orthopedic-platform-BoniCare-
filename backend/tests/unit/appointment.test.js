import * as dbHandler from '../utils/dbHandler.js';
import Appointment from '../../src/models/Appointment.js';
import User from '../../src/models/User.js';
import mongoose from 'mongoose';
import { APPOINTMENT_STATUS } from '../../src/config/constants.js';

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Appointment Model', () => {
  it('should create an appointment successfully', async () => {
    const patient = new User({ name: 'P', email: 'p@ex.com', passwordHash: 'pwd123', role: 'patient' });
    const doctor = new User({ name: 'D', email: 'd@ex.com', passwordHash: 'pwd123', role: 'doctor' });
    await patient.save();
    await doctor.save();

    const appointment = new Appointment({
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledDate: new Date('2026-04-10'),
      startTime: new Date('2026-04-10T10:00:00Z'),
      endTime: new Date('2026-04-10T10:30:00Z')
    });
    const saved = await appointment.save();
    expect(saved.status).toBe(APPOINTMENT_STATUS.SCHEDULED);
  });

  it('should prevent overlapping appointments for the same doctor', async () => {
    const doctor = new User({ name: 'D', email: 'd@ex.com', passwordHash: 'pwd123', role: 'doctor' });
    await doctor.save();
    const p1 = new User({ name: 'P1', email: 'p1@ex.com', passwordHash: 'pwd123', role: 'patient' });
    await p1.save();

    const a1 = new Appointment({
      patientId: p1._id,
      doctorId: doctor._id,
      scheduledDate: new Date('2026-04-10'),
      startTime: new Date('2026-04-10T10:00:00Z'),
      endTime: new Date('2026-04-10T10:30:00Z')
    });
    await a1.save();

    const a2 = new Appointment({
      patientId: p1._id,
      doctorId: doctor._id,
      scheduledDate: new Date('2026-04-10'),
      startTime: new Date('2026-04-10T10:15:00Z'), // Overlap
      endTime: new Date('2026-04-10T10:45:00Z')
    });

    let err;
    try { await a2.save(); } catch (e) { err = e; }
    expect(err).toBeDefined();
    expect(err.message).toContain('Overlap');
  });
});