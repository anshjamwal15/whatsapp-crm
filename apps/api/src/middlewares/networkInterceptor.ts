import { Request, Response, NextFunction } from 'express';

interface RequestLog {
  timestamp: string;
  method: string;
  url: string;
  headers: Record<string, any>;
  body: any;
  query: Record<string, any>;
}

interface ResponseLog {
  statusCode: number;
  headers: Record<string, any>;
  body: any;
  duration: number;
}

interface InterceptedRequest extends Request {
  rawBody?: Buffer;
  requestLog?: RequestLog;
}

/**
 * Middleware to capture and log raw request body
 */
export const captureRawBody = (
  req: InterceptedRequest,
  res: Response,
  buf: Buffer,
  encoding: string
) => {
  if (buf && buf.length) {
    req.rawBody = buf;
  }
};

/**
 * Network interceptor middleware that logs all incoming requests and responses
 */
export const networkInterceptor = (
  req: InterceptedRequest,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Capture request details
  const requestLog: RequestLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    headers: sanitizeHeaders(req.headers),
    body: req.body || null,
    query: req.query,
  };

  // Store request log for later use
  req.requestLog = requestLog;

  // Log incoming request
  console.log('\n========== INCOMING REQUEST ==========');
  console.log(`[${requestLog.timestamp}] ${requestLog.method} ${requestLog.url}`);
  console.log('Headers:', JSON.stringify(requestLog.headers, null, 2));
  if (Object.keys(requestLog.query).length > 0) {
    console.log('Query:', JSON.stringify(requestLog.query, null, 2));
  }
  if (requestLog.body && Object.keys(requestLog.body).length > 0) {
    console.log('Body:', JSON.stringify(requestLog.body, null, 2));
  }
  console.log('=====================================\n');

  // Store original send function
  const originalSend = res.send;

  // Override send to capture response
  res.send = function (data: any) {
    const duration = Date.now() - startTime;

    // Parse response body
    let responseBody = data;
    try {
      if (typeof data === 'string') {
        responseBody = JSON.parse(data);
      }
    } catch (e) {
      // Keep original data if not JSON
      responseBody = data;
    }

    const responseLog: ResponseLog = {
      statusCode: res.statusCode,
      headers: sanitizeHeaders(res.getHeaders()),
      body: responseBody,
      duration,
    };

    // Log outgoing response
    console.log('\n========== OUTGOING RESPONSE ==========');
    console.log(`[${new Date().toISOString()}] Status: ${responseLog.statusCode}`);
    console.log(`Duration: ${responseLog.duration}ms`);
    console.log('Headers:', JSON.stringify(responseLog.headers, null, 2));
    console.log('Body:', JSON.stringify(responseLog.body, null, 2));
    console.log('=======================================\n');

    // Call original send
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Sanitize headers to remove sensitive information
 */
function sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
  const sanitized = { ...headers };
  const sensitiveKeys = [
    'authorization',
    'cookie',
    'x-api-key',
    'x-auth-token',
    'password',
    'token',
    'secret',
  ];

  sensitiveKeys.forEach((key) => {
    if (sanitized[key]) {
      sanitized[key] = '[REDACTED]';
    }
  });

  return sanitized;
}

/**
 * Error logging middleware to capture errors
 */
export const errorInterceptor = (
  err: Error,
  req: InterceptedRequest,
  res: Response,
  next: NextFunction
) => {
  const duration = Date.now() - (req.requestLog ? new Date(req.requestLog.timestamp).getTime() : Date.now());

  console.log('\n========== ERROR INTERCEPTED ==========');
  console.log(`[${new Date().toISOString()}] Error in ${req.method} ${req.originalUrl}`);
  console.log(`Duration: ${duration}ms`);
  console.log('Error Message:', err.message);
  console.log('Error Stack:', err.stack);
  console.log('=======================================\n');

  next(err);
};
