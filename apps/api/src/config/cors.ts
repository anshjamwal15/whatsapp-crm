import { CorsOptions } from 'cors';

/**
 * CORS Configuration
 * Defines allowed origins and credentials for cross-origin requests
 */

const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // API server (for testing)
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

// Add production origins from environment variable
if (process.env.ALLOWED_ORIGINS) {
  const envOrigins = process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim());
  allowedOrigins.push(...envOrigins);
}

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

/**
 * Simple CORS configuration for development
 * Use corsOptions for production
 */
export const corsOptionsDev: CorsOptions = {
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
