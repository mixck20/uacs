import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { createItem, listItems, updateItem, deleteItem } from '../controllers/inventoryController.js';

const router = Router();
router.use(authenticate);

router.post('/', authorize('admin','staff'), createItem);
router.get('/', authorize('admin','staff','student','faculty'), listItems);
router.put('/:id', authorize('admin','staff'), updateItem);
router.delete('/:id', authorize('admin','staff'), deleteItem);

export default router;
