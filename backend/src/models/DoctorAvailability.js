import mongoose from "mongoose";
import { DAYS_OF_WEEK } from "../config/constants.js";

const doctorAvailabilitySchema = new mongoose.Schema({
  doctorProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DoctorProfile",
    required: true
  },
  dayOfWeek: {
    type: String,
    enum: DAYS_OF_WEEK,
    required: true
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: props => `${props.value} is not a valid HH:mm time!`
    }
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: props => `${props.value} is not a valid HH:mm time!`
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const DoctorAvailability = mongoose.model("DoctorAvailability", doctorAvailabilitySchema);

export default DoctorAvailability;