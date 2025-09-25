// ...existing code...
import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'pcs' },
  reorderLevel: { type: Number, default: 0 },
  expiryDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  category: { type: String, enum: ['Medicine', 'Equipment', 'Supplies'], default: 'Medicine' } // added category
}, { versionKey: false });

// ...existing code...
export const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);