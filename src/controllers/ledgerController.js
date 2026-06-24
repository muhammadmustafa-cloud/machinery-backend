import Ledger from '../models/Ledger.js';
import Item from '../models/Item.js';
import Machine from '../models/Machine.js';

export const getLedger = async (req, res) => {
  try {
    const { itemId, machineId, startDate, endDate } = req.query;
    let query = {};
    if (itemId) query.item = itemId;
    if (machineId) query.machine = machineId;

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
      .populate('performedBy', 'name email')
      .sort({ date: -1 });
      
    res.json(ledgerEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStock = async (req, res) => {
  try {
    const { item: itemId, quantity, price, supplier, remarks, date } = req.body;

    if (quantity <= 0) return res.status(400).json({ message: 'Quantity must be greater than zero' });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const ledgerEntry = await Ledger.create({
      type: 'IN',
      item: itemId,
      quantity,
      price,
      supplier,
      remarks,
      date: date || Date.now(),
      performedBy: req.user._id
    });

    // Update item stock
    item.currentStock += Number(quantity);
    await item.save();

    res.status(201).json(ledgerEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const consumeStock = async (req, res) => {
  try {
    const { item: itemId, quantity, machine: machineId, remarks, date } = req.body;

    if (quantity <= 0) return res.status(400).json({ message: 'Quantity must be greater than zero' });
    if (!machineId) return res.status(400).json({ message: 'Machine ID is required for consumption' });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.currentStock < quantity) {
      return res.status(400).json({ message: `Insufficient stock. Available: ${item.currentStock}` });
    }

    const machine = await Machine.findById(machineId);
    if (!machine) return res.status(404).json({ message: 'Machine not found' });

    const ledgerEntry = await Ledger.create({
      type: 'OUT',
      item: itemId,
      quantity,
      machine: machineId,
      remarks,
      date: date || Date.now(),
      performedBy: req.user._id
    });

    // Update item stock
    item.currentStock -= Number(quantity);
    await item.save();

    res.status(201).json(ledgerEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
