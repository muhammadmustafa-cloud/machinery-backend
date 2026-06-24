import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String },
  unit: { type: String, required: true, default: 'pcs' },
  currentStock: { type: Number, default: 0 },
  minStockAlert: { type: Number, default: 5 }, // For low stock alerts
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;
