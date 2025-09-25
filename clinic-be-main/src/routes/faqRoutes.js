import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createFaq, listFaq } from '../controllers/faqController.js';

const router = Router();
router.use(authenticate);

router.post('/', authorize('admin','staff'), createFaq);
router.get('/', authorize('admin','staff','student','faculty'), listFaq);

export default router;
