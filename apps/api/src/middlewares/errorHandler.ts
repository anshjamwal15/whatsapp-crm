import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
    });
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    code: 'INTERNAL_SERVER_ERROR',
  });
};
