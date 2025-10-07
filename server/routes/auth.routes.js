/**
 * Rotas de Autenticação
 * @description Endpoints para login, perfil e autenticação
 */

import express from 'express';
import {
  login,
  getMe,
  updateProfile,
  logout,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.post('/login', login);
router.post('/logout', logout);

// Rotas protegidas
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
