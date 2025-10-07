/**
 * Model User - Usuário administrador
 * @description Schema do Mongoose para autenticação de administradores
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      maxlength: [100, 'Nome não pode ter mais de 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor, insira um email válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [8, 'Senha deve ter pelo menos 8 caracteres'],
      select: false, // Não retornar senha em queries por padrão
    },
    role: {
      type: String,
      enum: ['admin', 'editor'],
      default: 'admin',
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adiciona createdAt e updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================================
// MIDDLEWARE - Criptografar senha antes de salvar
// ============================================================================

userSchema.pre('save', async function (next) {
  // Só criptografa se a senha foi modificada
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// MÉTODOS DA INSTÂNCIA
// ============================================================================

/**
 * Comparar senha fornecida com hash do banco
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Erro ao comparar senhas');
  }
};

/**
 * Gerar token JWT
 */
userSchema.methods.generateAuthToken = function () {
  const payload = {
    id: this._id,
    email: this.email,
    role: this.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Verificar se conta está bloqueada
 */
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

/**
 * Incrementar tentativas de login
 */
userSchema.methods.incrementLoginAttempts = async function () {
  // Reset se o bloqueio expirou
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Bloquear após 5 tentativas (15 minutos)
  const maxAttempts = 5;
  const lockTime = 15 * 60 * 1000; // 15 minutos

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return await this.updateOne(updates);
};

/**
 * Reset tentativas de login (após sucesso)
 */
userSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $set: { loginAttempts: 0, lastLogin: Date.now() },
    $unset: { lockUntil: 1 },
  });
};

// ============================================================================
// MÉTODOS ESTÁTICOS
// ============================================================================

/**
 * Criar primeiro usuário admin (seed)
 */
userSchema.statics.createDefaultAdmin = async function () {
  try {
    const adminExists = await this.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const admin = await this.create({
        name: process.env.ADMIN_NAME || 'Administrador',
        email: process.env.ADMIN_EMAIL || 'admin@fundacao.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
      });

      console.log('✅ Usuário admin padrão criado:', admin.email);
      return admin;
    }

    return adminExists;
  } catch (error) {
    console.error('❌ Erro ao criar admin padrão:', error.message);
    throw error;
  }
};

// ============================================================================
// ÍNDICES
// ============================================================================

userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });

const User = mongoose.model('User', userSchema);

export default User;
