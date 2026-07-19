import mongoose from 'mongoose';

const ledgerSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['IN', 'OUT', 'ADJUSTMENT'] // IN = Purchase, OUT = Consumed in Machine, ADJUSTMENT = Old Stock/Corrections
  },
  adjustmentType: {
    type: String,
    enum: ['ADD', 'REMOVE']
  },
  item: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 0.01
  },
  // Only required if type is OUT
  machine: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Machine' 
  },
  // For cost tracking on IN transactions
  price: { 
    type: Number,
    default: 0
  },
  supplier: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  remarks: { 
    type: String 
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Ledger = mongoose.model('Ledger', ledgerSchema);
export default Ledger;
