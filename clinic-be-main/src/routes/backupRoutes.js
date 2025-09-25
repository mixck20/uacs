import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { snapshotBackup } from '../controllers/backupController.js';

const router = Router();
router.use(authenticate);
router.post('/snapshot', authorize('admin'), snapshotBackup);

export default router;
