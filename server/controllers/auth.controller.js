/**
 * Controller de Autenticação
 * @description Gerencia login, registro e autenticação de usuários
 */

import User from '../models/User.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Login de usuário
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validar campos
  if (!email || !password) {
    return next(new AppError('Por favor, forneça email e senha', 400));
  }

  // Buscar usuário (incluindo senha)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Credenciais inválidas', 401));
  }

  // Verificar se conta está bloqueada
  if (user.isLocked()) {
    const minutosRestantes = Math.ceil((user.lockUntil - Date.now()) / 60000);
    return next(
      new AppError(
        `Conta bloqueada devido a múltiplas tentativas. Tente novamente em ${minutosRestantes} minutos.`,
        423
      )
    );
  }

  // Verificar senha
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    // Incrementar tentativas de login
    await user.incrementLoginAttempts();
    return next(new AppError('Credenciais inválidas', 401));
  }

  // Verificar se usuário está ativo
  if (!user.isActive) {
    return next(new AppError('Conta desativada. Entre em contato com o administrador.', 403));
  }

  // Reset tentativas e atualizar último login
  await user.resetLoginAttempts();

  // Gerar token
  const token = user.generateAuthToken();

  // Remover senha da resposta
  user.password = undefined;

  res.status(200).json({
    success: true,
    message: 'Login realizado com sucesso',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  });
});

/**
 * @desc    Obter usuário logado
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    },
  });
});

/**
 * @desc    Atualizar perfil do usuário
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new AppError('Usuário não encontrado', 404));
  }

  // Atualizar nome
  if (name) {
    user.name = name;
  }

  // Atualizar email (verificar se já existe)
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new AppError('Email já está em uso', 400));
    }
    user.email = email;
  }

  // Atualizar senha (requer senha atual)
  if (newPassword) {
    if (!currentPassword) {
      return next(new AppError('Senha atual é obrigatória para alterar a senha', 400));
    }

    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return next(new AppError('Senha atual incorreta', 401));
    }

    if (newPassword.length < 8) {
      return next(new AppError('Nova senha deve ter pelo menos 8 caracteres', 400));
    }

    user.password = newPassword;
  }

  await user.save();

  // Gerar novo token
  const token = user.generateAuthToken();

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: 'Perfil atualizado com sucesso',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    },
  });
});

/**
 * @desc    Logout (client-side apenas - remove token)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout realizado com sucesso',
  });
});
