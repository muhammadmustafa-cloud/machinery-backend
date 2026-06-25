import Ledger from '../models/Ledger.js';
import Item from '../models/Item.js';
import Machine from '../models/Machine.js';

export const getLedger = async (req, res) => {
  try {
    const { itemId, machineId, supplierId, startDate, endDate, type } = req.query;
    let query = {};
    if (itemId) query.item = itemId;
    if (machineId) query.machine = machineId;
    if (supplierId) query.supplier = supplierId;
    if (type) query.type = type;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const ledgerEntries = await Ledger.find(query)
      .populate('item', 'name sku unit')
      .populate('machine', 'name code')
      .populate('supplier', 'name')
      .populate('performedBy', 'name email')
      .sort({ date: -1 });
      
    res.json(ledgerEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const { type, supplier, machine, items, remarks, date } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items array is required' });
    }
    
    if (type === 'IN' && !supplier) {
      return res.status(400).json({ message: 'Supplier is required for Stock In' });
    }
    if (type === 'OUT' && !machine) {
      return res.status(400).json({ message: 'Machine is required for Used transactions' });
    }

    const savedEntries = [];
    const actualDate = date || Date.now();

    for (let i of items) {
      if (!i.item || !i.quantity || i.quantity <= 0) continue;
      
      const itemDoc = await Item.findById(i.item);
      if (!itemDoc) continue;

      if (type === 'IN') {
        itemDoc.currentStock += Number(i.quantity);
      } else if (type === 'OUT') {
        if (itemDoc.currentStock < Number(i.quantity)) {
          return res.status(400).json({ message: `Insufficient stock for ${itemDoc.name}. Available: ${itemDoc.currentStock}` });
        }
        itemDoc.currentStock -= Number(i.quantity);
      }
      await itemDoc.save();

      const ledgerEntry = new Ledger({
        type,
        item: i.item,
        quantity: i.quantity,
        price: type === 'IN' ? i.price : undefined,
        supplier: type === 'IN' ? supplier : undefined,
        machine: type === 'OUT' ? machine : undefined,
        remarks,
        date: actualDate,
        performedBy: req.user._id
      });

      const saved = await ledgerEntry.save();
      savedEntries.push(saved);
    }

    res.status(201).json(savedEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
