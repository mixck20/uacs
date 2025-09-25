import Joi from 'joi';
import { HealthRecord } from '../models/HealthRecord.js';

const visitSchema = Joi.object({
  date: Joi.date().default(() => new Date()),
  complaint: Joi.string().allow('', null),
  vitals: Joi.object({
    bp: Joi.string().allow('', null).default(''),
    temp: Joi.string().allow('', null).default(''),
    pulse: Joi.string().allow('', null).default('')
  }).default({ bp: '', temp: '', pulse: '' }),
  diagnosis: Joi.string().allow('', null),
  treatment: Joi.string().allow('', null),
  prescriptions: Joi.string().allow('', null),
  tests: Joi.array().items(Joi.string()).default([]),
  followUp: Joi.string().allow('', null),
  staff: Joi.string().allow('', null),
  notes: Joi.string().allow('', null)
});

export async function initRecord(req, res) {
  try {
    const { patientId } = req.body;
    if (!patientId) return res.status(400).json({ message: 'patientId required' });

    const exists = await HealthRecord.findOne({ patient: patientId });
    if (exists) return res.status(409).json({ message: 'Record already exists' });

    const rec = await HealthRecord.create({ patient: patientId, visits: [] });
    await rec.populate('patient');
    res.status(201).json(rec);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getRecord(req, res) {
  try {
    const rec = await HealthRecord.findOne({ patient: req.params.patientId }).populate('patient');
    if (!rec) return res.status(404).json({ message: 'Not found' });
    res.json(rec);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function addVisit(req, res) {
  try {
    const { error, value } = visitSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    let rec = await HealthRecord.findOne({ patient: req.params.patientId });

    // auto-create record if missing so frontend can add without calling /init
    if (!rec) {
      rec = await HealthRecord.create({ patient: req.params.patientId, visits: [] });
    }

    const visit = {
      ...value,
      attendedBy: req.user && req.user._id ? req.user._id : undefined
    };

    rec.visits.push(visit);
    rec.lastUpdated = new Date();
    await rec.save();

    await rec.populate('patient');
    res.status(201).json(rec);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}