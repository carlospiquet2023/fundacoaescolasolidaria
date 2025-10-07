/**
 * Índice de Modelos
 * Exporta todos os modelos do banco de dados
 */

import Aluno from './Aluno.js';
import FichaPreMatricula from './FichaPreMatricula.js';
import Documento from './Documento.js';
import Carteirinha from './Carteirinha.js';

// Modelos antigos (manter compatibilidade)
import User from './User.js';
import Receita from './Receita.js';
import HomeContent from './HomeContent.js';

export {
    // Novos modelos (Sistema de Alunos)
    Aluno,
    FichaPreMatricula,
    Documento,
    Carteirinha,
    
    // Modelos antigos
    User,
    Receita,
    HomeContent
};
