import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { memberService, InviteMemberRequest, UpdateMemberRoleRequest } from '../services/member.service';

const router: Router = Router();

/**
 * @swagger
 * /api/businesses/{businessId}/members:
 *   get:
 *     summary: List all members of a business
 *     description: Retrieve all members of a business (requires authentication and tenant access)
 *     tags: [Members]
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
 *         description: List of members retrieved successfully
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
      const members = await memberService.listMembers(req.params.businessId);

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

/**
 * @swagger
 * /api/businesses/{businessId}/members/{memberId}:
 *   get:
 *     summary: Get a specific member
 *     description: Retrieve a specific member by ID (requires authentication and tenant access)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MemberResponse'
 *       404:
 *         description: Member not found
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
  '/:businessId/members/:memberId',
  authMiddleware,
  tenantMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const member = await memberService.getMemberById(
        req.params.businessId,
        req.params.memberId
      );

      if (!member) {
        res.status(404).json({
          success: false,
          error: 'Member not found',
        });
        return;
      }

      res.json({
        success: true,
        data: member,
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
 *   post:
 *     summary: Invite/Create a new member
 *     description: Invite a new member to the business (requires authentication, tenant access, and admin role)
 *     tags: [Members]
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
 *             $ref: '#/components/schemas/InviteMemberRequest'
 *     responses:
 *       201:
 *         description: Member invited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MemberResponse'
 *                 message:
 *                   type: string
 *                   example: Member invited successfully
 *       400:
 *         description: Bad request - Missing required fields or invalid role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Only admins can invite members
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
  '/:businessId/members',
  authMiddleware,
  tenantMiddleware,
  adminMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, name, role, phone } = req.body as InviteMemberRequest;

      // Validation
      if (!email || !name || !role) {
        res.status(400).json({
          success: false,
          error: 'Email, name, and role are required',
        });
        return;
      }

      // Validate role
      const validRoles = ['admin', 'member', 'viewer'];
      if (!validRoles.includes(role)) {
        res.status(400).json({
          success: false,
          error: 'Invalid role. Must be one of: admin, member, viewer',
        });
        return;
      }

      const member = await memberService.inviteMember(
        req.params.businessId,
        req.user!.userId,
        { email, name, role, phone }
      );

      res.status(201).json({
        success: true,
        data: member,
        message: 'Member invited successfully',
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
 * /api/businesses/{businessId}/members/{memberId}/role:
 *   patch:
 *     summary: Change member role
 *     description: Update a member's role (requires authentication, tenant access, and admin role)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMemberRoleRequest'
 *     responses:
 *       200:
 *         description: Member role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/MemberResponse'
 *                 message:
 *                   type: string
 *                   example: Member role updated successfully
 *       400:
 *         description: Bad request - Missing role or invalid role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Only admins can change member roles
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
router.patch(
  '/:businessId/members/:memberId/role',
  authMiddleware,
  tenantMiddleware,
  adminMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { role } = req.body as UpdateMemberRoleRequest;

      // Validation
      if (!role) {
        res.status(400).json({
          success: false,
          error: 'Role is required',
        });
        return;
      }

      // Validate role
      const validRoles = ['admin', 'member', 'viewer'];
      if (!validRoles.includes(role)) {
        res.status(400).json({
          success: false,
          error: 'Invalid role. Must be one of: admin, member, viewer',
        });
        return;
      }

      const member = await memberService.changeMemberRole(
        req.params.businessId,
        req.params.memberId,
        role
      );

      res.json({
        success: true,
        data: member,
        message: 'Member role updated successfully',
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
 * /api/businesses/{businessId}/members/{memberId}:
 *   delete:
 *     summary: Disable member
 *     description: Disable a member (soft delete) - requires authentication, tenant access, and admin role
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *         description: Business ID
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member disabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: Forbidden - Only admins can disable members
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
  '/:businessId/members/:memberId',
  authMiddleware,
  tenantMiddleware,
  adminMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await memberService.disableMember(req.params.businessId, req.params.memberId);

      res.json({
        success: true,
        message: 'Member disabled successfully',
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
