import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  complaint: { type: String, default: '' },
  vitals: {
    bp: { type: String, default: '' },
    temp: { type: String, default: '' },
    pulse: { type: String, default: '' }
  },
  diagnosis: { type: String, default: '' },
  treatment: { type: String, default: '' },
  prescriptions: { type: String, default: '' },
  tests: { type: [String], default: [] }, // filenames or identifiers for uploaded tests
  followUp: { type: String, default: '' },
  staff: { type: String, default: '' }, // attending nurse/doctor name from frontend
  notes: { type: String, default: '' },
  attendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const healthRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  visits: { type: [visitSchema], default: [] },
  lastUpdated: { type: Date, default: Date.now }
}, { versionKey: false });

export const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);