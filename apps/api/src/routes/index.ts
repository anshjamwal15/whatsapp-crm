import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import businessRoutes from './business.routes';

const router: Router = Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/businesses', businessRoutes);

export default router;
