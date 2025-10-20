import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
 
const saltRounds = 10;

export const signup = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message:'Missing fields' });
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already registered' });
        const hash = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ 
            name,
            email,
            phone,
            role, 
            passwordHash: hash });
        const token = jwt.sign({ id: user._id, role: user.role },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        return res.status(201).json({ token, user: { id: user._id, name: user.name,email: user.email, role: user.role } });
        }catch (err) {
        console.error('❌ Signup Error:', err);
        return  res.status(500).json({ message: 'Server error' });
        }
    };

    export const login = async (req, res) => {
        try{
            const { email, password } = req.body;
            if(!email || !password) return res.status(400).json({message:'Missing fields'});
            const user = await User.findOne({email});
            if(!user) return res.status(401).json({message:'Invalid credentials'});
            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if(!isMatch) return res.status(401).json({message:'Invalid credentials'});
            const token = jwt.sign(
                {id: user._id, role: user.role},
                process.env.JWT_SECRET,
                {expiresIn: process.env.JWT_EXPIRES_IN || '7d'}
            );
            return res.status(200).json({token, 
                user:{
                    id: user._id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role}}); 
        }catch(err){
            console.error('❌ Login Error:', err);
            return res.status(500).json({message:'Server error'});
        }
    } 