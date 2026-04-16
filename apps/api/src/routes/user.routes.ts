import { Router, Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { SignupRequest } from '../database/models';
import { authMiddleware } from '../middlewares';

const router: Router = Router();

/**
 * GET /api/users
 * Get all users (protected)
 */
router.get('/', authMiddleware, async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allUsers = await userService.getAllUsers();
    res.json({
      success: true,
      data: allUsers,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/:id
 * Get user by ID (protected)
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/users
 * Create a new user (protected - admin only)
 */
router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, name, phone, password } = req.body as SignupRequest;

    // Validation
    if (!email || !name) {
      res.status(400).json({
        success: false,
        error: 'Email and name are required',
      });
      return;
    }

    const newUser = await userService.createUser({
      email,
      name,
      phone,
      passwordHash: password
    });

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/users/:id
 * Update user (protected - owner or admin)
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user is updating their own profile or is admin
    if (req.user?.userId !== id) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: You can only update your own profile',
      });
      return;
    }

    const updatedUser = await userService.updateUser(id, updateData);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/users/:id
 * Delete user (protected - owner or admin)
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if user is deleting their own profile or is admin
    if (req.user?.userId !== id) {
      res.status(403).json({
        success: false,
        error: 'Forbidden: You can only delete your own profile',
      });
      return;
    }

    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
