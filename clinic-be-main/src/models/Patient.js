import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // optional link
  schoolId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  sex: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  birthDate: { type: Date, required: true },
  role: { type: String, enum: ['Student','Faculty'], default: 'Student' },
  courseYear: { type: String },
  contactNumber: { type: String },
  address: { type: String },
  allergies: [{ type: String }],
  bloodType: { type: String },
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  notes: { type: String },
  emailUpdates: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

export const Patient = mongoose.model('Patient', patientSchema);
