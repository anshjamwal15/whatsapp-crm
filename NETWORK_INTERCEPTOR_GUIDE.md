# Network Interceptor Guide

## Overview

The network interceptor is a comprehensive middleware system that logs all incoming HTTP requests and outgoing responses, including headers, bodies, and response status codes. It also captures errors and their stack traces.

## Features

- **Request Logging**: Captures method, URL, headers, query parameters, and body
- **Response Logging**: Captures status code, headers, body, and response duration
- **Sensitive Data Redaction**: Automatically redacts authorization tokens, cookies, and other sensitive headers
- **Error Tracking**: Logs errors with full stack traces
- **Performance Metrics**: Tracks request duration in milliseconds
- **Formatted Output**: Pretty-printed JSON for easy debugging

## Installation

The interceptor is already created in `apps/api/src/middlewares/networkInterceptor.ts`

## Usage

### Basic Setup

Add the interceptor to your Express app in `apps/api/src/index.ts`:

```typescript
import express, { Express, Request, Response } from 'express';
import { networkInterceptor, errorInterceptor, captureRawBody } from './middlewares';

const app: Express = express();

// CORS Middleware
app.use(cors(corsOptionsDev));

// Capture raw body for logging
app.use(express.json({ verify: captureRawBody }));
app.use(express.urlencoded({ extended: true, verify: captureRawBody }));

// Network interceptor (add early in middleware chain)
app.use(networkInterceptor);

// ... rest of your middleware and routes ...

// Error interceptor (must be after all other middleware)
app.use(errorInterceptor);
app.use(errorHandler);
```

### Complete Example

```typescript
import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { errorHandler, networkInterceptor, errorInterceptor, captureRawBody } from './middlewares';
import { corsOptionsDev } from './config/cors';
import apiRoutes from './routes';

const app: Express = express();
const PORT: number = parseInt(process.env.PORT ?? '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS Middleware
app.use(cors(corsOptionsDev));

// Middleware with raw body capture
app.use(express.json({ verify: captureRawBody }));
app.use(express.urlencoded({ extended: true, verify: captureRawBody }));

// Network interceptor
app.use(networkInterceptor);

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

// Error interceptor (before final error handler)
app.use(errorInterceptor);

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
});

export default app;
```

## Output Examples

### Incoming Request Log

```
========== INCOMING REQUEST ==========
[2024-01-15T10:30:45.123Z] POST /api/auth/login
Headers: {
  "content-type": "application/json",
  "user-agent": "Mozilla/5.0",
  "authorization": "[REDACTED]"
}
Query: {}
Body: {
  "email": "user@example.com",
  "password": "[REDACTED]"
}
=====================================
```

### Outgoing Response Log

```
========== OUTGOING RESPONSE ==========
[2024-01-15T10:30:45.234Z] Status: 200
Duration: 111ms
Headers: {
  "content-type": "application/json; charset=utf-8",
  "content-length": "256"
}
Body: {
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "123",
      "email": "user@example.com"
    }
  }
}
=======================================
```

### Error Log

```
========== ERROR INTERCEPTED ==========
[2024-01-15T10:30:46.500Z] Error in POST /api/auth/login
Duration: 1234ms
Error Message: Database connection failed
Error Stack: Error: Database connection failed
    at connectDB (database/config.ts:45:12)
    at processRequest (index.ts:89:23)
=======================================
```

## Sensitive Data Redaction

The interceptor automatically redacts the following headers:
- `authorization`
- `cookie`
- `x-api-key`
- `x-auth-token`
- `password`
- `token`
- `secret`

To add more sensitive headers, modify the `sensitiveKeys` array in the `sanitizeHeaders` function.

## Performance Considerations

- The interceptor adds minimal overhead (typically < 1ms per request)
- Response duration is measured from middleware initialization to response send
- For high-traffic applications, consider:
  - Disabling in production or using environment-based logging
  - Implementing log rotation
  - Using a dedicated logging service

## Environment-Based Logging

To disable logging in production:

```typescript
if (NODE_ENV === 'development') {
  app.use(networkInterceptor);
}
```

Or use an environment variable:

```typescript
if (process.env.LOG_NETWORK_REQUESTS === 'true') {
  app.use(networkInterceptor);
}
```

## Customization

### Modify Logged Headers

Edit the `sanitizeHeaders` function to customize which headers are redacted:

```typescript
function sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
  const sanitized = { ...headers };
  const sensitiveKeys = [
    'authorization',
    'cookie',
    'x-api-key',
    // Add more as needed
  ];
  // ...
}
```

### Custom Logging Format

Modify the console.log statements in `networkInterceptor` and `errorInterceptor` to use your preferred logging library (Winston, Pino, etc.):

```typescript
// Example with Winston
import logger from './logger';

console.log('...') // Replace with:
logger.info('...', { /* structured data */ });
```

## Integration with Logging Services

To integrate with services like Datadog, New Relic, or CloudWatch:

```typescript
export const networkInterceptor = (
  req: InterceptedRequest,
  res: Response,
  next: NextFunction
) => {
  // ... existing code ...

  // Send to logging service
  logToService({
    type: 'request',
    method: requestLog.method,
    url: requestLog.url,
    headers: requestLog.headers,
    body: requestLog.body,
  });

  // ... rest of code ...
};
```

## Troubleshooting

### Logs not appearing

1. Ensure middleware is added before routes
2. Check that `NODE_ENV` is set correctly
3. Verify console output is not being suppressed

### Missing request body

1. Ensure `captureRawBody` is passed to `express.json()`
2. Check that request has `Content-Type: application/json`

### Performance issues

1. Consider disabling in production
2. Implement log sampling for high-traffic endpoints
3. Use async logging to prevent blocking

## API Reference

### `networkInterceptor(req, res, next)`

Main middleware for logging requests and responses.

**Parameters:**
- `req`: Express Request object (extended with `requestLog` property)
- `res`: Express Response object
- `next`: Express next function

### `errorInterceptor(err, req, res, next)`

Error handling middleware for logging errors.

**Parameters:**
- `err`: Error object
- `req`: Express Request object
- `res`: Express Response object
- `next`: Express next function

### `captureRawBody(req, res, buf, encoding)`

Middleware verify function for capturing raw request body.

**Parameters:**
- `req`: Express Request object
- `res`: Express Response object
- `buf`: Buffer containing request body
- `encoding`: String encoding type

## License

This interceptor is part of the main application and follows the same license.
