import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares';
import { corsOptionsDev } from './config/cors';
import apiRoutes from './routes';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT ?? '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS Middleware
app.use(cors(corsOptionsDev));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRoutes);

// 404 handler
app.use((_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    code: 'NOT_FOUND',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, async (): Promise<void> => {
  try {
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`CORS enabled for development`);
});

// Graceful shutdown
process.on('SIGTERM', async (): Promise<void> => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async (): Promise<void> => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
