import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { tenantMiddleware } from '../middlewares/tenantMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import { memberService, InviteMemberRequest, UpdateMemberRoleRequest } from '../services/member.service';

const router: Router = Router();

/**
 * GET /api/businesses/:businessId/members
 * List all members of a business
 * Requires authentication and tenant access
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
 * GET /api/businesses/:businessId/members/:memberId
 * Get a specific member
 * Requires authentication and tenant access
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
 * POST /api/businesses/:businessId/members
 * Invite/Create a new member
 * Requires authentication, tenant access, and admin role
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
 * PATCH /api/businesses/:businessId/members/:memberId/role
 * Change member role
 * Requires authentication, tenant access, and admin role
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
 * DELETE /api/businesses/:businessId/members/:memberId
 * Disable member (soft delete)
 * Requires authentication, tenant access, and admin role
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
