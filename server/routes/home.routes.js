/**
 * Rotas de Home Content
 * @description Endpoints para gerenciar conteúdo da página inicial
 */

import express from 'express';
import {
  getHomeContent,
  getHomeContentAdmin,
  updateHomeContent,
  updateHomeSection,
  addItemToSection,
  removeItemFromSection,
  togglePublish,
} from '../controllers/home.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/', getHomeContent);

// Rotas protegidas (Admin)
router.get('/admin', protect, authorize('admin', 'editor'), getHomeContentAdmin);
router.put('/', protect, authorize('admin'), updateHomeContent);
router.patch('/:section', protect, authorize('admin'), updateHomeSection);
router.post('/:section/add', protect, authorize('admin'), addItemToSection);
router.delete('/:section/:itemId', protect, authorize('admin'), removeItemFromSection);
router.patch('/publish', protect, authorize('admin'), togglePublish);

export default router;
