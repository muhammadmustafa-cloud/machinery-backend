import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  location: { type: String },
  status: { 
    type: String, 
    required: true, 
    enum: ['Active', 'Under Maintenance', 'Inactive'],
    default: 'Active' 
  },
}, { timestamps: true });

const Machine = mongoose.model('Machine', machineSchema);
export default Machine;
