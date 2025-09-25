import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { exportData } from '../controllers/exportController.js';

const router = Router();
router.use(authenticate);
router.get('/:type', authorize('admin','staff'), exportData);

export default router;
