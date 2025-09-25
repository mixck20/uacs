import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createAnnouncement, listAnnouncements, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';

const router = Router();
router.use(authenticate);

router.post('/', authorize('admin','staff'), createAnnouncement);
router.get('/', authorize('admin','staff','student','faculty'), listAnnouncements);
router.put('/:id', authorize('admin','staff'), updateAnnouncement);
router.delete('/:id', authorize('admin','staff'), deleteAnnouncement);

export default router;
