# Database Seeding System

This directory contains modular scripts to populate the BoniCare database with realistic development data.

## Scripts

- `npm run seed`: Run full database seeding.
- `npm run seed:reset`: Clear all existing collections and run full database seeding.

## Directory Structure

- `index.js`: Main entry point.
- `userSeed.js`: Seeds User profiles (Patients and Doctors).
- `patientSeed.js`: Seeds Patient data.
- `doctorSeed.js`: Seeds Doctor data.
- `appointmentSeed.js`: Seeds Appointments.
- `supportingSeed.js`: Seeds AiReports and medicalFiles.
- `helper.js`: Shared utility and Faker instance.

## Safety
All scripts check `NODE_ENV`. They will throw an error if `NODE_ENV` is set to 'production'.
