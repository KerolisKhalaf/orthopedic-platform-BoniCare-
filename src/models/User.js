import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String ,require: true},
    email: {type: String ,require: true, unique: true, lowercase: true},
    phone: {type: String },
    passwordHash: {type: String ,require: true, minlength: 6},
    role: {type: String ,enum: ['patient','doctor','admin'], default: 'patient'},
    fcmToken: {type: String},
    createdAt: {type: Date, default: Date.now}

});

export default mongoose.model('User', userSchema);
