import Machine from '../models/Machine.js';

export const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find({});
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMachine = async (req, res) => {
  try {
    const { name, code, location, status } = req.body;

    const machineExists = await Machine.findOne({ code });
    if (machineExists) {
      return res.status(400).json({ message: 'Machine with this code already exists' });
    }

    const machine = await Machine.create({
      name, code, location, status
    });

    res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (machine) {
      machine.name = req.body.name || machine.name;
      machine.code = req.body.code || machine.code;
      machine.location = req.body.location || machine.location;
      machine.status = req.body.status || machine.status;

      const updatedMachine = await machine.save();
      res.json(updatedMachine);
    } else {
      res.status(404).json({ message: 'Machine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (machine) {
      await machine.deleteOne();
      res.json({ message: 'Machine removed' });
    } else {
      res.status(404).json({ message: 'Machine not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
