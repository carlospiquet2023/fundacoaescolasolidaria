/**
 * Middleware de Tratamento de Erros
 * @description Centralize error handling para toda aplicação
 */

/**
 * Classe de erro personalizada
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware de tratamento de erros
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro (desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Erro:', err);
  }

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new AppError(message, 400);
  }

  // Erro de cast do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    const message = `Recurso não encontrado com ID: ${err.value}`;
    error = new AppError(message, 404);
  }

  // Erro de chave duplicada do MongoDB (código 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} já existe. Por favor, use outro valor.`;
    error = new AppError(message, 400);
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido. Por favor, faça login novamente.';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado. Por favor, faça login novamente.';
    error = new AppError(message, 401);
  }

  // Resposta da API
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Wrapper assíncrono para evitar try-catch em todos os controllers
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
