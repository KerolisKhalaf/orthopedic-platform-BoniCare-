import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';
import errorHandler from "./src/middleware/errorHandler.js";

// Routes
import authRouter from './src/routes/auth.js';
import filesRouter from './src/routes/files.js';
import patientRouter from './src/routes/patient.js';
import doctorRouter from './src/routes/doctor.js';
import appointmentRouter from './src/routes/appointment.js';
import notificationRouter from './src/api/notificationApi.js';

import swaggerUi from 'swagger-ui-express';
import { specs } from './src/swagger.js';
import { initSocket } from './src/chat/socket.js';

dotenv.config();
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! ðŸ’¥ Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

connectDB();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/files', filesRouter);
app.use('/api/v1/patient', patientRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/appointment', appointmentRouter);
app.use('/api/v1/notification', notificationRouter);

app.use(errorHandler);

app.get('/', (req, res) => res.send('BoniCare Orthopedic Platform API running'));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Initialize Socket.IO
await initSocket(server).then(() => console.log('Socket.IO initialized')).catch(err => console.error('Socket.IO init failed:', err));


// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! ðŸ’¥ Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
