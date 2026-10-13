import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import storeRoutes from './routes/storeRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for frontend clients
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

import { cacheService } from './services/cacheService';

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'DS Wardrobe Commerce Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    cache: cacheService.getStatus(),
    database: {
      driver: process.env.DATABASE_URL ? 'postgresql' : 'json_transactional',
      storage: 'persistent'
    }
  });
});

// Mount Routes
app.use('/api/store', storeRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`✨ DS Wardrobe Commerce API Server running on http://localhost:${PORT}`);
  console.log(`📦 Store Endpoints: http://localhost:${PORT}/api/store/products`);
  console.log(`⚙️ Admin Endpoints: http://localhost:${PORT}/api/admin/analytics`);
});
