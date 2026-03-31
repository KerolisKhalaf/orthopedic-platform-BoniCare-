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
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  yearsOfExperience: {
    type: Number,
    required: true
  },
  hospitalInfo: {
    type: String
  }
}, { timestamps: true });

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);

export default DoctorProfile;