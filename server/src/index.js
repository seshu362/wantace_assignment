import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Config } from './models/Config.js';
import { seedData, seedLeads } from './seed.js';
import { Lead } from './models/Lead.js';

import { getPublicConfig, getAdminConfig, updateAdminConfig } from './controllers/configController.js';
import { createEstimateAndLead, getAdminLeads } from './controllers/leadController.js';
import { loginOwner, checkAuth } from './controllers/authController.js';
import { authenticateOwner } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public Routes
app.get('/api/config', getPublicConfig);
app.post('/api/estimate', createEstimateAndLead);
app.post('/api/auth/login', loginOwner);

// Protected Admin Routes
app.get('/api/auth/me', authenticateOwner, checkAuth);
app.get('/api/admin/config', authenticateOwner, getAdminConfig);
app.put('/api/admin/config', authenticateOwner, updateAdminConfig);
app.get('/api/admin/leads', authenticateOwner, getAdminLeads);

// Auto-seed if database is empty on boot
async function initServer() {
  await connectDB();

  try {
    const configCount = await Config.countDocuments();
    if (configCount === 0) {
      console.log('Database is empty. Populating Seed Version 3 and historical leads...');
      await Config.create(seedData);
      await Lead.insertMany(seedLeads);
      console.log('Database seeded successfully!');
    }
  } catch (seedErr) {
    console.error('Seeding check notice:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Public Config Endpoint: http://localhost:${PORT}/api/config`);
    console.log(`====================================================`);
  });
}

initServer().catch((err) => {
  console.error('Failed to start server:', err);
});
