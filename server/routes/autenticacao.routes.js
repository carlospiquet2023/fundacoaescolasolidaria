/**
 * Rotas de Autenticação
 * @route /api/auth
 */

import express from 'express';
const router = express.Router();
import {
    login,
    registrar,
    obterUsuarioLogado,
    logout,
    trocarSenha,
    resetarSenha
} from '../controllers/autenticacao.controller.js';
import {
    autenticar,
    autorizarAdmin
} from '../middleware/autenticacao.js';

// Rotas públicas
router.post('/login', login);

// Rotas protegidas (requer autenticação)
router.get('/eu', autenticar, obterUsuarioLogado);
router.post('/logout', autenticar, logout);
router.put('/trocar-senha', autenticar, trocarSenha);

// Rotas admin
router.post('/registrar', autenticar, autorizarAdmin, registrar);
router.post('/resetar-senha/:id', autenticar, autorizarAdmin, resetarSenha);

export default router;
