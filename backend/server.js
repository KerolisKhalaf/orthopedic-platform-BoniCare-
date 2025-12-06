 import express from 'express';
 import dotenv from 'dotenv';
 import cors from 'cors';
 import morgan from 'morgan';
 import authRouter from './src/routes/auth.js';
 import { connectDB } from './src/config/db.js';
import filesRouter from './src/routes/files.js';
import patientRouter from './src/routes/patient.js';
import { errorHandler } from "./src/middleware/errorHandler.js";


dotenv.config();
const app = express();
 app.use(cors());
 app.use(express.json({ limit: '10mb' }));
 app.use(morgan('dev'));

 connectDB();

 app.use('/api/auth', authRouter);
 app.use('/api/files', filesRouter);
app.use('/api/patient', patientRouter);

app.use(errorHandler);

 app.get('/', (req, res) => res.send('Orthopedic Platform API running'));
 
 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));









