import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { requestAppointment, listAppointments, updateAppointment } from '../controllers/appointmentController.js';

const router = Router();
router.use(authenticate);

router.post('/', authorize('student','faculty','admin','staff'), requestAppointment);
router.get('/', authorize('admin','staff','student','faculty'), listAppointments);
router.put('/:id', authorize('admin','staff'), updateAppointment);

export default router;
