 import express from 'express';
 import dotenv from 'dotenv';
 import cors from 'cors';
 import morgan from 'morgan';
 import authRouter from './src/routes/auth.js';
 import { connectDB } from './src/config/db.js';

dotenv.config();
const app = express();
 app.use(cors());
 app.use(express.json({ limit: '10mb' }));
 app.use(morgan('dev'));

 connectDB();

 app.use('/api/auth', authRouter);
 
 app.get('/', (req, res) => res.send('Orthopedic Platform API running'));
 
 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));









