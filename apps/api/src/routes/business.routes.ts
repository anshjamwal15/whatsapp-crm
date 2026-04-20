import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { businessService } from '../services/business.service';
import { CreateBusinessRequest, UpdateBusinessRequest } from '../database/models/business';

const router: Router = Router();

/**
 * @swagger
 * /api/businesses:
 *   post:
 *     summary: Create a new business
 *     description: Create a new business/workspace (requires authentication)
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBusinessRequest'
 *     responses:
 *       201:
 *         description: Business created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BusinessResponse'
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/businesses:
 *   get:
 *     summary: Get all businesses for current user
 *     description: Retrieve all businesses/workspaces for the authenticated user
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of businesses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BusinessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/businesses/owner/workspaces:
 *   get:
 *     summary: Get all workspaces where user is owner
 *     description: Retrieve all workspaces where the authenticated user is the owner
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of owned workspaces retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BusinessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/businesses/{businessId}:
 *   get:
 *     summary: Get a specific business
 *     description: Retrieve a specific business by ID (requires authentication and tenant access)
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *     responses:
 *       200:
 *         description: Business retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BusinessResponse'
 *       404:
 *         description: Business not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/businesses/{businessId}:
 *   put:
 *     summary: Update a business
 *     description: Update business information (requires authentication, tenant access, and admin role)
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBusinessRequest'
 *     responses:
 *       200:
 *         description: Business updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BusinessResponse'
 *       403:
 *         description: Forbidden - Only admins can update business information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/businesses/{businessId}:
 *   delete:
 *     summary: Delete a business
 *     description: Delete a business (soft delete) - requires authentication, tenant access, and admin role
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *     responses:
 *       200:
 *         description: Business deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: Forbidden - Only admins can delete businesses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @swagger
 * /api/businesses/{businessId}/members:
 *   get:
 *     summary: Get business members
 *     description: Retrieve all members of a business (requires authentication and tenant access)
 *     tags: [Businesses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *     responses:
 *       200:
 *         description: List of business members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MemberResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
