/**
 * Middleware de Autenticação JWT
 * Protege rotas que requerem autenticação
 */

import jwt from 'jsonwebtoken';
import { Aluno } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fundacao_escola_solidaria_secret_key_2024_super_segura';

/**
 * Middleware principal de autenticação
 * Verifica se o token JWT é válido
 */
const autenticar = async (req, res, next) => {
    try {
        // Buscar token do header Authorization ou cookies
        let token;
        
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }
        
        if (!token) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Acesso negado. Token não fornecido.'
            });
        }
        
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Buscar usuário no banco
        const aluno = await Aluno.findById(decoded.id).select('-senha');
        
        if (!aluno) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Token inválido. Usuário não encontrado.'
            });
        }
        
        if (!aluno.ativo) {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Conta desativada. Entre em contato com o administrador.'
            });
        }
        
        // Adicionar usuário ao request
        req.usuario = aluno;
        req.usuarioId = aluno._id;
        req.role = aluno.role;
        
        next();
        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Token inválido.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                sucesso: false,
                mensagem: 'Token expirado. Faça login novamente.'
            });
        }
        
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao verificar autenticação.',
            erro: error.message
        });
    }
};

/**
 * Middleware para verificar se usuário é admin
 * Usar após o middleware autenticar
 */
const autorizarAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Autenticação necessária.'
        });
    }
    
    if (req.usuario.role !== 'admin') {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado. Apenas administradores podem acessar.'
        });
    }
    
    next();
};

/**
 * Middleware para verificar se usuário é aluno
 * Usar após o middleware autenticar
 */
const autorizarAluno = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Autenticação necessária.'
        });
    }
    
    if (req.usuario.role !== 'aluno') {
        return res.status(403).json({
            sucesso: false,
            mensagem: 'Acesso negado. Apenas alunos podem acessar.'
        });
    }
    
    next();
};

/**
 * Middleware opcional - não bloqueia se não houver token
 * Útil para rotas que funcionam com ou sem autenticação
 */
const autenticarOpcional = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }
        
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const aluno = await Aluno.findById(decoded.id).select('-senha');
            
            if (aluno && aluno.ativo) {
                req.usuario = aluno;
                req.usuarioId = aluno._id;
                req.role = aluno.role;
            }
        }
        
        next();
        
    } catch {
        // Continua sem autenticação - token inválido ou expirado
        next();
    }
};

/**
 * Gerar token JWT
 */
const gerarToken = (id) => {
    return jwt.sign(
        { id },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

export {
    autenticar,
    autorizarAdmin,
    autorizarAluno,
    autenticarOpcional,
    gerarToken
};
