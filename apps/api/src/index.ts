import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import { db } from './database/config';
import { users } from './database/schema';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT ?? '3000', 10);

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use((_req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
const server = app.listen(PORT, async (): Promise<void> => {
  try {
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
  console.log(`Server running on http://localhost:${PORT}`);
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
