import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  concern: { type: String, required: true },
  preferredDate: { type: Date },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
