import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import machineRoutes from './routes/machineRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/suppliers', supplierRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('Machinery Mill API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
