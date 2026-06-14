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
      // استخدام Dynamic Import لحل مشكلة Circular Dependency
      const DoctorProfile = (await import('./DoctorProfile.js')).default;
      await DoctorProfile.create({ userId: doc._id });
    } else if (doc.role === 'patient') {
      // استخدام Dynamic Import لحل مشكلة Circular Dependency
      const Patient = (await import('./patient.js')).default;
      await Patient.create({ user: doc._id });
    }
    next();
  } catch (error) {
    next(error); // تمرير الخطأ للميدل وير العام
  }
});

export default mongoose.model('User', userSchema);