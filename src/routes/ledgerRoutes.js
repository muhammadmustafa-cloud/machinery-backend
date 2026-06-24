import express from 'express';
import { getLedger, addStock, consumeStock } from '../controllers/ledgerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getLedger);

router.route('/in')
  .post(protect, addStock);

router.route('/out')
  .post(protect, consumeStock);

export default router;
