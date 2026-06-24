import express from 'express';
import { getMachines, createMachine, updateMachine, deleteMachine } from '../controllers/machineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMachines)
  .post(protect, createMachine);

router.route('/:id')
  .put(protect, updateMachine)
  .delete(protect, deleteMachine);

export default router;
