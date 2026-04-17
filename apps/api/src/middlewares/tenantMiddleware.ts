import { Request, Response, NextFunction } from 'express';
import { db } from '../database/config';
import { businessMembers } from '../database/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Extend Express Request to include tenant info
 */
declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      userRole?: string;
      businessId?: string;
    }
  }
}

/**
 * Tenant middleware
 * Validates that the authenticated user has access to the requested business/tenant
 * Extracts businessId from URL params and verifies membership
 */
export async function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Extract businessId from URL params
    const businessId = req.params.businessId;

    if (!businessId) {
      res.status(400).json({
        success: false,
        error: 'Business ID is required',
      });
      return;
    }

    // Check if user is a member of this business
    const membership = await db
      .select()
      .from(businessMembers)
      .where(
        and(
          eq(businessMembers.businessId, businessId),
          eq(businessMembers.userId, req.user.userId),
          eq(businessMembers.status, 'active')
        )
      )
      .limit(1);

    if (!membership || membership.length === 0) {
      res.status(403).json({
        success: false,
        error: 'Access denied. You do not have access to this business.',
      });
      return;
    }

    // Attach tenant info to request
    req.tenantId = businessId;
    req.businessId = businessId;
    req.userRole = membership[0].role;

    next();
  } catch (error) {
    console.error('Tenant middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Optional tenant middleware
 * Does not fail if businessId is missing, but validates if present
 */
export async function optionalTenantMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      next();
      return;
    }

    // Extract businessId from URL params or query
    const businessId = req.params.businessId || req.query.businessId;

    if (!businessId) {
      next();
      return;
    }

    // Check if user is a member of this business
    const membership = await db
      .select()
      .from(businessMembers)
      .where(
        and(
          eq(businessMembers.businessId, businessId as string),
          eq(businessMembers.userId, req.user.userId),
          eq(businessMembers.status, 'active')
        )
      )
      .limit(1);

    if (membership && membership.length > 0) {
      req.tenantId = businessId as string;
      req.businessId = businessId as string;
      req.userRole = membership[0].role;
    }

    next();
  } catch (error) {
    console.error('Optional tenant middleware error:', error);
    next();
  }
}
