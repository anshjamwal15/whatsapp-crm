import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { businessService } from '../services/business.service';
import { CreateBusinessRequest, UpdateBusinessRequest } from '../database/models/business';

const router: Router = Router();

/**
 * POST /api/businesses
 * Create a new business
 * Requires authentication
 */
router.post(
  '/',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, businessType, phone, email, timezone, country, currency, logoUrl } =
        req.body as CreateBusinessRequest;

      // Validation
      if (!name) {
        res.status(400).json({
          success: false,
          error: 'Business name is required',
        });
        return;
      }

      const business = await businessService.createBusiness(req.user!.userId, {
        name,
        businessType,
        phone,
        email,
        timezone,
        country,
        currency,
        logoUrl,
      });

      res.status(201).json({
        success: true,
        data: business,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        next(error);
      }
    }
  }
);

/**
 * GET /api/businesses
 * Get all businesses for the current user
 * Requires authentication
 */
router.get(
  '/',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const businesses = await businessService.getUserBusinesses(req.user!.userId);

      res.json({
        success: true,
        data: businesses,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        next(error);
      }
    }
  }
);

/**
 * GET /api/businesses/owner/workspaces
 * Get all workspaces where user is owner
 * Requires authentication
 */
router.get(
  '/owner/workspaces',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspaces = await businessService.getOwnerWorkspaces(req.user!.userId);

      res.json({
        success: true,
        data: workspaces,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        next(error);
      }
    }
  }
);

/**
 * GET /api/businesses/:businessId
 * Get a specific business
 * Requires authentication and tenant access
 */
router.get(
  '/:businessId',
  authMiddleware,
  tenantMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const business = await businessService.getBusinessById(req.params.businessId);

      if (!business) {
        res.status(404).json({
          success: false,
          error: 'Business not found',
        });
        return;
      }

      res.json({
        success: true,
        data: business,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        next(error);
      }
    }
  }
);

/**
 * PUT /api/businesses/:businessId
 * Update a business
 * Requires authentication, tenant access, and admin role
 */
router.put(
  '/:businessId',
  authMiddleware,
  tenantMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check if user has admin role
      if (req.userRole !== 'admin' && req.userRole !== 'owner') {
        res.status(403).json({
          success: false,
          error: 'Only admins can update business information',
        });
        return;
      }

      const { name, businessType, phone, email, timezone, country, currency, logoUrl, status } =
        req.body as UpdateBusinessRequest;

      const business = await businessService.updateBusiness(req.params.businessId, {
        name,
        businessType,
        phone,
        email,
        timezone,
        country,
        currency,
        logoUrl,
        status,
      });

      res.json({
        success: true,
        data: business,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        next(error);
      }
    }
  }
);

/**
 * DELETE /api/businesses/:businessId
 * Delete a business (soft delete)
 * Requires authentication, tenant access, and admin role
 */
router.delete(
  '/:businessId',
  authMiddleware,
  tenantMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check if user has admin role
      if (req.userRole !== 'admin' && req.userRole !== 'owner') {
        res.status(403).json({
          success: false,
          error: 'Only admins can delete businesses',
        });
        return;
      }

      await businessService.deleteBusiness(req.params.businessId);

      res.json({
        success: true,
        message: 'Business deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        next(error);
      }
    }
  }
);

/**
 * GET /api/businesses/:businessId/members
 * Get business members
 * Requires authentication and tenant access
 */
router.get(
  '/:businessId/members',
  authMiddleware,
  tenantMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const members = await businessService.getBusinessMembers(req.params.businessId);

      res.json({
        success: true,
        data: members,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        next(error);
      }
    }
  }
);

export default router;
