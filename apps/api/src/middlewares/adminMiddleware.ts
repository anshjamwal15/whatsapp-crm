import { Request, Response, NextFunction } from 'express';

/**
 * Admin middleware
 * Validates that the authenticated user has admin or owner role for the business
 * Must be used AFTER tenantMiddleware as it depends on req.userRole
 */
export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Ensure tenant middleware has run and set userRole
    if (!req.userRole) {
      res.status(403).json({
        success: false,
        error: 'Access denied. Business membership required.',
      });
      return;
    }

    // Check if user has admin or owner role
    if (req.userRole !== 'admin' && req.userRole !== 'owner') {
      res.status(403).json({
        success: false,
        error: 'Access denied. Admin or owner role required.',
      });
      return;
    }

    // User has admin privileges, proceed
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
