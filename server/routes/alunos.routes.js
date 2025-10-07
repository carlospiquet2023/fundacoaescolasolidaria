/**
 * Rotas de Alunos
 * @route /api/alunos
 */

import express from 'express';
const router = express.Router();
import {
    listarAlunos,
    obterAluno,
    atualizarAluno,
    desativarAluno,
    reativarAluno,
    obterEstatisticas
} from '../controllers/alunos.controller.js';
import {
    autenticar,
    autorizarAdmin
} from '../middleware/autenticacao.js';

// Todas as rotas requerem autenticação
router.use(autenticar);

// Rotas gerais (admin ou próprio aluno)
router.get('/:id', obterAluno);
router.put('/:id', atualizarAluno);

// Rotas admin
router.get('/', autorizarAdmin, listarAlunos);
router.delete('/:id', autorizarAdmin, desativarAluno);
router.put('/:id/reativar', autorizarAdmin, reativarAluno);
router.get('/admin/estatisticas', autorizarAdmin, obterEstatisticas);

export default router;
