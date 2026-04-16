import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services';
import { LoginRequest, SignupRequest } from '../database/models/auth';

const router: Router = Router();

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    const result = await authService.login({ email, password });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({
        success: false,
        error: error.message,
      });
    } else {
      next(error);
    }
  }
});

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name, phone } = req.body as SignupRequest;

    // Validation
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        error: 'Email, password, and name are required',
      });
      return;
    }

    const result = await authService.signup({ email, password, name, phone });

    res.status(201).json({
      success: true,
      data: result,
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
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).userId; // Assumes middleware sets this

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    await authService.logout(userId);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post(
  '/refresh',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token is required',
        });
        return;
      }

      const newAccessToken = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({
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
