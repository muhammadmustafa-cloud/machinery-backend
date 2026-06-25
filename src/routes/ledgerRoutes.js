import express from 'express';
import { getLedger, addTransaction } from '../controllers/ledgerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getLedger);

router.post('/transaction', protect, addTransaction);

export default router;
