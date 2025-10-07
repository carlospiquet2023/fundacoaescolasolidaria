/* eslint-disable no-console */
/**
 * Server Principal - API REST para CMS Fundação Escola Solidária
 * @description Backend Node.js/Express com MongoDB para gerenciamento de conteúdo
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Importar configurações e rotas
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import homeRoutes from './routes/home.routes.js';
import receitasRoutes from './routes/receitas.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import autenticacaoRoutes from './routes/autenticacao.routes.js';
import alunosRoutes from './routes/alunos.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Configuração de __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar ao banco de dados
connectDB();

// ============================================================================
// MIDDLEWARE DE SEGURANÇA
// ============================================================================

// Helmet - Headers de segurança HTTP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.tailwindcss.com', 'https://cdnjs.cloudflare.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.tailwindcss.com'],
        frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.google.com'],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS - Permitir acesso do frontend
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sem origin (mobile apps, Postman, etc)
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiting - Proteção contra brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requests por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Apenas 5 tentativas de login a cada 15 minutos
  message: 'Muitas tentativas de login, tente novamente em 15 minutos.',
  skipSuccessfulRequests: true,
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Sanitização de dados MongoDB - Previne NoSQL injection
app.use(mongoSanitize());

// ============================================================================
// MIDDLEWARE DE PARSING E LOGGING
// ============================================================================

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Compressão de respostas
app.use(compression());

// Logger HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================================================
// SERVIR ARQUIVOS ESTÁTICOS
// ============================================================================

// Servir painel admin
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Servir arquivos da raiz (para index.html)
app.use(express.static(path.join(__dirname, '..')));

// Servir frontend público
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../src')));

// Servir uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/assets/images')));

// ============================================================================
// ROTAS DA API
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Rotas de autenticação (antigas - manter compatibilidade)
app.use('/api/auth', authRoutes);

// Novas rotas de autenticação JWT
app.use('/api/autenticacao', autenticacaoRoutes);
app.use('/api/alunos', alunosRoutes);

// Rotas de conteúdo (protegidas)
app.use('/api/home', homeRoutes);
app.use('/api/receitas', receitasRoutes);
app.use('/api/upload', uploadRoutes);

// Rota para servir o painel admin
app.get('/admin*', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin/index.html'));
});

// Rota catch-all para SPA (frontend público)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// ============================================================================
// TRATAMENTO DE ERROS
// ============================================================================

app.use(errorHandler);

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

const server = app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`   Servidor rodando na porta ${PORT}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ========================================');
  console.log('');
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔐 Admin:    http://localhost:${PORT}/admin`);
  console.log(`⚡ API:      http://localhost:${PORT}/api`);
  console.log('');
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ ERRO NÃO TRATADO:', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recebido. Encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado.');
    process.exit(0);
  });
});

export default app;
