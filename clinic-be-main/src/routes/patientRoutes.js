import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createPatient, listPatients, getPatient, updatePatient, deletePatient } from '../controllers/patientController.js';

const router = Router();
router.use(authenticate);

// staff/admin only for write
router.post('/', authorize('admin','staff'), createPatient);
router.get('/', authorize('admin','staff'), listPatients);
router.get('/:id', authorize('admin','staff'), getPatient);
router.put('/:id', authorize('admin','staff'), updatePatient);
router.delete('/:id', authorize('admin','staff'), deletePatient);

export default router;
