/**
 * Rotas de Receitas
 * @description Endpoints para gerenciar receitas financeiras
 */

import express from 'express';
import {
  getReceitas,
  getReceitasAdmin,
  getReceita,
  createReceita,
  updateReceita,
  deleteReceita,
  getEstatisticas,
  toggleDestaque,
  cancelarReceita,
} from '../controllers/receitas.controller.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/', getReceitas);
router.get('/stats/all', getEstatisticas);
router.get('/:id', optionalAuth, getReceita);

// Rotas protegidas (Admin)
router.get('/admin/all', protect, authorize('admin', 'editor'), getReceitasAdmin);
router.post('/', protect, authorize('admin'), createReceita);
router.put('/:id', protect, authorize('admin'), updateReceita);
router.delete('/:id', protect, authorize('admin'), deleteReceita);
router.patch('/:id/destaque', protect, authorize('admin'), toggleDestaque);
router.patch('/:id/cancelar', protect, authorize('admin'), cancelarReceita);

export default router;
