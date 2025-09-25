import Joi from 'joi';
import { Faq } from '../models/Faq.js';

const faqSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).default([])
});

export async function createFaq(req, res) {
  const { error, value } = faqSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const faq = await Faq.create(value);
  res.status(201).json(faq);
}

export async function listFaq(req, res) {
  const { q, tag } = req.query;
  const filter = {};
  if (q) filter.$or = [{ question: { $regex: q, $options: 'i' } }, { answer: { $regex: q, $options: 'i' } }];
  if (tag) filter.tags = tag;
  const items = await Faq.find(filter).sort({ createdAt: -1 });
  res.json(items);
}
