import Joi from 'joi';
import { Patient } from '../models/Patient.js';

const patientSchema = Joi.object({
  schoolId: Joi.string().required(),
  fullName: Joi.string().required(),
  sex: Joi.string().valid('Male','Female','Other').required(),
  birthDate: Joi.date().required(),
  role: Joi.string().valid('Student','Faculty').default('Student'),
  courseYear: Joi.string().allow('', null),
  contactNumber: Joi.string().allow('', null),
  address: Joi.string().allow('', null),
  allergies: Joi.array().items(Joi.string()).default([]),
  bloodType: Joi.string().allow('', null),
  emergencyContact: Joi.object({
    name: Joi.string().allow('', null),
    relation: Joi.string().allow('', null),
    phone: Joi.string().allow('', null)
  }).default({}),
  notes: Joi.string().allow('', null),
  emailUpdates: Joi.boolean().default(false)
});

export async function createPatient(req, res) {
  const { error, value } = patientSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const exists = await Patient.findOne({ schoolId: value.schoolId });
  if (exists) return res.status(409).json({ message: 'schoolId already exists' });
  const patient = await Patient.create(value);
  res.status(201).json(patient);
}

export async function listPatients(req, res) {
  const { q } = req.query;
  const filter = q ? { fullName: { $regex: q, $options: 'i' } } : {};
  const items = await Patient.find(filter).limit(200).sort({ createdAt: -1 });
  res.json(items);
}

export async function getPatient(req, res) {
  const item = await Patient.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}

export async function updatePatient(req, res) {
  const { error, value } = patientSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const item = await Patient.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}

export async function deletePatient(req, res) {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
}
