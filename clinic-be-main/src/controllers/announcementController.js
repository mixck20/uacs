import Joi from 'joi';
import { Announcement } from '../models/Announcement.js';

const schema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  audience: Joi.string().valid('all','students','faculty').default('all'),
  active: Joi.boolean().default(true)
});

export async function createAnnouncement(req, res) {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const ann = await Announcement.create({ ...value, createdBy: req.user._id });
  res.status(201).json(ann);
}

export async function listAnnouncements(req, res) {
  const { audience } = req.query;
  const filter = { active: true };
  if (audience) filter.audience = audience;
  const items = await Announcement.find(filter).sort({ createdAt: -1 });
  res.json(items);
}

export async function updateAnnouncement(req, res) {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const updated = await Announcement.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
}

export async function deleteAnnouncement(req, res) {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
}
