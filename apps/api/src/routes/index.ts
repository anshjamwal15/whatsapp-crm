import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import businessRoutes from './business.routes';
import memberRoutes from './member.routes';

const router: Router = Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/businesses', businessRoutes);
router.use('/businesses', memberRoutes);

export default router;
