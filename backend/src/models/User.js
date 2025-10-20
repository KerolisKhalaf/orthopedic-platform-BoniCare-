import mongoose from 'mongoose';
const userSchema = new mongoose.schema({
    name: {type: string ,require: true},
    email: {type: string ,require: true, unique: true, lowercase: true},
    phone: {type: string },
    passwordHash: {type: string ,require: true, minlength: 6},
    role: {type: string ,enum: ['patient','doctor','admin'], default: 'patient'},
    createdAt: {type: Date, default: Date.now}

});

export default mongoose.model('User', userSchema);
