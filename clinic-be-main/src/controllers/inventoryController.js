// ...existing code...
import Joi from 'joi';
import { InventoryItem } from '../models/InventoryItem.js';

const invSchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().allow('', null).empty(''),
  // treat empty string as empty so default applies when field sent as ""
  quantity: Joi.number().integer().min(0).default(0).empty(''),
  unit: Joi.string().default('pcs').empty(''),
  reorderLevel: Joi.number().integer().min(0).default(0).empty(''),
  // allow empty string or null for expiryDate
  expiryDate: Joi.date().allow(null).empty(''),
  // accept category and default to Medicine when not provided or empty
  category: Joi.string().valid('Medicine', 'Equipment', 'Supplies').default('Medicine').empty('')
});

export async function createItem(req, res) {
  try {
    const { error, value } = invSchema.validate(req.body, { convert: true, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    // If expiryDate was sent as empty string it will become undefined; ensure null if explicitly empty
    if (req.body.expiryDate === '') value.expiryDate = null;

    const item = await InventoryItem.create(value);
    res.status(201).json(item);
  } catch (err) {
    console.error('createItem error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function listItems(req, res) {
  try {
    const { lowStock } = req.query;
    const filter = {};
    if (lowStock === '1') filter.$expr = { $lte: ['$quantity', '$reorderLevel'] };
    const items = await InventoryItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('listItems error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateItem(req, res) {
  try {
    const { error, value } = invSchema.validate(req.body, { convert: true, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    if (req.body.expiryDate === '') value.expiryDate = null;

    const updated = await InventoryItem.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('updateItem error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteItem(req, res) {
  try {
    await InventoryItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteItem error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
// ...existing code...