import Joi from 'joi';
import { Appointment } from '../models/Appointment.js';

const createSchema = Joi.object({
  concern: Joi.string().required(),
  preferredDate: Joi.date().allow(null)
});

export async function requestAppointment(req, res) {
  const { error, value } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const app = await Appointment.create({ requester: req.user._id, ...value });
  res.status(201).json(app);
}

export async function listAppointments(req, res) {
  const { mine } = req.query;
  const filter = mine === '1' ? { requester: req.user._id } : {};
  const items = await Appointment.find(filter).populate('requester','name email role').sort({ createdAt: -1 });
  res.json(items);
}

const updateSchema = Joi.object({
  status: Joi.string().valid('pending','approved','rejected','completed').optional(),
  assignedTo: Joi.string().allow(null, ''),
  notes: Joi.string().allow('', null)
});

export async function updateAppointment(req, res) {
  const { error, value } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const updated = await Appointment.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
}
