import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅MongoDB connected'))
    .catch(err => console.error('❌ DB Error:',err));

app.get('/', (req, res) => res.send('Orthopedic Platform API running...'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀Server running on port ${PORT}`);
});










