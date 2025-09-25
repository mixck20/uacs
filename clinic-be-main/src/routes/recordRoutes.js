import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { initRecord, getRecord, addVisit } from '../controllers/recordController.js';

const router = Router();
router.use(authenticate);

router.post('/init', authorize('admin','staff'), initRecord);
router.get('/:patientId', authorize('admin','staff'), getRecord);
router.post('/:patientId/visits', authorize('admin','staff'), addVisit);

export default router;