import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
import AppError from '../utils/AppError.js';
 
const saltRounds = 10;

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               phone: { type: string }
 *               role: { type: string, enum: [patient, doctor, admin] }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields
 *       409:
 *         description: Email already registered
 */
export const signup = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
        throw new AppError('Missing fields', 400);
    }
    
    const existing = await User.findOne({ email });
    if (existing) {
        throw new AppError('Email already registered', 409);
    }
    
    const hash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ 
        name,
        email,
        phone,
        role, 
        passwordHash: hash 
    });
    
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    return res.status(201).json({ 
        success: true,
        token, 
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
        } 
    });
};

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid credentials
 */
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError('Missing fields', 400);
    }
    
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
    }
    
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    return res.status(200).json({
        success: true,
        token, 
        user: {
            id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role
        }
    }); 
};