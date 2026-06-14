import mongoose from 'mongoose';

const doctorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    validate: {
      validator: async function(v) {
        const user = await mongoose.model('User').findById(v);
        return user && user.role === 'doctor';
      },
      message: props => "User must have a 'doctor' role!"
    }
  },
  specialty: {
    type: String,
  },
  bio: {
    type: String,
  },
  licenseNumber: {
    type: String,
    unique: true
  },
  yearsOfExperience: {
    type: Number,
  },
  hospitalInfo: {
    type: String
  }
}, { timestamps: true });

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);

export default DoctorProfile;