import express from 'express';
import { 
  getItems, 
  getItemById, 
  createItem, 
  resolveItem, 
  deleteItem, 
  getStats, 
  getDropoffs 
} from '../controllers/itemController.js';

const router = express.Router();

router.get('/stats', getStats);
router.get('/dropoffs', getDropoffs);
router.get('/', getItems);
router.get('/:id', getItemById);
router.post('/', createItem);
router.put('/:id/resolve', resolveItem);
router.delete('/:id', deleteItem);

export default router;
