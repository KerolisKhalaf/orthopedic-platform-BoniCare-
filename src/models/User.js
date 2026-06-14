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

userSchema.post('save', async function(doc, next) {
  try {
    if (doc.role === 'doctor') {
      const DoctorProfile = (await import('./DoctorProfile.js')).default;
      // استخدم upsert بدلاً من create
      await DoctorProfile.findOneAndUpdate(
        { userId: doc._id }, 
        { userId: doc._id }, 
        { upsert: true, new: true }
      );
    } else if (doc.role === 'patient') {
      const Patient = (await import('./patient.js')).default;
      await Patient.findOneAndUpdate(
        { user: doc._id }, 
        { user: doc._id }, 
        { upsert: true, new: true }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});
export default mongoose.model('User', userSchema);