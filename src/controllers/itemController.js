import Item from '../models/Item.js';

export const getItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const { name, sku, description, unit, minStockAlert } = req.body;

    const itemExists = await Item.findOne({ sku });
    if (itemExists) {
      return res.status(400).json({ message: 'Item with this SKU already exists' });
    }

    const item = await Item.create({
      name, sku, description, unit, minStockAlert, currentStock: 0
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      item.name = req.body.name || item.name;
      item.sku = req.body.sku || item.sku;
      item.description = req.body.description || item.description;
      item.unit = req.body.unit || item.unit;
      item.minStockAlert = req.body.minStockAlert || item.minStockAlert;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      // Typically, you shouldn't delete an item if it has ledger history, but for simplicity:
      await item.deleteOne();
      res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
