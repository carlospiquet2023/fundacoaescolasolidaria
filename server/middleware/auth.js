/**
 * Middleware de Autenticação JWT
 * @description Valida token JWT e protege rotas privadas
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware para proteger rotas (requer autenticação)
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Extrair token do header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar se token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado. Token não fornecido.',
      });
    }

    try {
      // Verificar e decodificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuário (sem a senha)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não encontrado.',
        });
      }

      // Verificar se usuário está ativo
      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Conta desativada. Entre em contato com o administrador.',
        });
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado. Faça login novamente.',
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido.',
        });
      }

      throw error;
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao validar autenticação.',
    });
  }
};

/**
 * Middleware para verificar papel/permissão do usuário
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Não autorizado.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Usuário com papel '${req.user.role}' não tem permissão para acessar este recurso.`,
      });
    }

    next();
  };
};

/**
 * Middleware opcional de autenticação (não bloqueia se não tiver token)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // Token inválido, mas não bloqueia
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next();
  }
};
