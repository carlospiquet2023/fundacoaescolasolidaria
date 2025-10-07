/**
 * Controller de Receitas
 * @description Gerencia CRUD de receitas financeiras
 */

import Receita from '../models/Receita.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Listar receitas (público - apenas visíveis)
 * @route   GET /api/receitas
 * @access  Public
 */
export const getReceitas = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    categoria,
    ano,
    mes,
    status = 'confirmado',
    destaque,
  } = req.query;

  const query = { visivel: true, status };

  // Filtros
  if (categoria) {
    query.categoria = categoria;
  }
  if (destaque) {
    query.destaque = destaque === 'true';
  }

  // Filtro por período
  if (ano) {
    const anoNum = parseInt(ano);
    let dataInicio, dataFim;

    if (mes) {
      const mesNum = parseInt(mes) - 1;
      dataInicio = new Date(anoNum, mesNum, 1);
      dataFim = new Date(anoNum, mesNum + 1, 0, 23, 59, 59);
    } else {
      dataInicio = new Date(anoNum, 0, 1);
      dataFim = new Date(anoNum, 11, 31, 23, 59, 59);
    }

    query.dataReceita = { $gte: dataInicio, $lte: dataFim };
  }

  const skip = (page - 1) * limit;

  const [receitas, total] = await Promise.all([
    Receita.find(query)
      .sort({ dataReceita: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-transacao.comprovante -origem.documento'),
    Receita.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: receitas,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Listar todas as receitas (admin)
 * @route   GET /api/receitas/admin
 * @access  Private (Admin)
 */
export const getReceitasAdmin = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    categoria,
    status,
    search,
    sortBy = '-dataReceita',
  } = req.query;

  const query = {};

  if (categoria) {
    query.categoria = categoria;
  }
  if (status) {
    query.status = status;
  }

  // Busca textual
  if (search) {
    query.$or = [
      { titulo: { $regex: search, $options: 'i' } },
      { descricao: { $regex: search, $options: 'i' } },
      { 'origem.nome': { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [receitas, total] = await Promise.all([
    Receita.find(query)
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('criadoPor', 'name email')
      .populate('atualizadoPor', 'name email'),
    Receita.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: receitas,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Obter uma receita específica
 * @route   GET /api/receitas/:id
 * @access  Public (se visível) / Private (admin)
 */
export const getReceita = asyncHandler(async (req, res, next) => {
  const receita = await Receita.findById(req.params.id)
    .populate('criadoPor', 'name')
    .populate('atualizadoPor', 'name');

  if (!receita) {
    return next(new AppError('Receita não encontrada', 404));
  }

  // Se não for admin, verificar se está visível
  if (!req.user && !receita.visivel) {
    return next(new AppError('Receita não disponível', 403));
  }

  res.status(200).json({
    success: true,
    data: receita,
  });
});

/**
 * @desc    Criar nova receita
 * @route   POST /api/receitas
 * @access  Private (Admin)
 */
export const createReceita = asyncHandler(async (req, res) => {
  // Adicionar usuário criador
  req.body.criadoPor = req.user.id;
  req.body.atualizadoPor = req.user.id;

  const receita = await Receita.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Receita criada com sucesso',
    data: receita,
  });
});

/**
 * @desc    Atualizar receita
 * @route   PUT /api/receitas/:id
 * @access  Private (Admin)
 */
export const updateReceita = asyncHandler(async (req, res, next) => {
  const receita = await Receita.findById(req.params.id);

  if (!receita) {
    return next(new AppError('Receita não encontrada', 404));
  }

  // Atualizar campos
  Object.keys(req.body).forEach((key) => {
    if (req.body[key] !== undefined && key !== 'criadoPor') {
      receita[key] = req.body[key];
    }
  });

  receita.atualizadoPor = req.user.id;
  await receita.save();

  res.status(200).json({
    success: true,
    message: 'Receita atualizada com sucesso',
    data: receita,
  });
});

/**
 * @desc    Deletar receita
 * @route   DELETE /api/receitas/:id
 * @access  Private (Admin)
 */
export const deleteReceita = asyncHandler(async (req, res, next) => {
  const receita = await Receita.findById(req.params.id);

  if (!receita) {
    return next(new AppError('Receita não encontrada', 404));
  }

  await receita.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Receita deletada com sucesso',
    data: {},
  });
});

/**
 * @desc    Obter estatísticas de receitas
 * @route   GET /api/receitas/stats/all
 * @access  Public
 */
export const getEstatisticas = asyncHandler(async (req, res) => {
  const { ano } = req.query;

  const stats = await Receita.obterEstatisticas();
  
  let porCategoria = [];
  let porMes = [];

  if (ano) {
    porCategoria = await Receita.totalPorCategoria(parseInt(ano));
    porMes = await Receita.totalPorMes(parseInt(ano));
  }

  res.status(200).json({
    success: true,
    data: {
      geral: stats,
      porCategoria,
      porMes,
    },
  });
});

/**
 * @desc    Marcar/desmarcar receita como destaque
 * @route   PATCH /api/receitas/:id/destaque
 * @access  Private (Admin)
 */
export const toggleDestaque = asyncHandler(async (req, res, next) => {
  const receita = await Receita.findById(req.params.id);

  if (!receita) {
    return next(new AppError('Receita não encontrada', 404));
  }

  if (receita.destaque) {
    await receita.removerDestaque();
  } else {
    await receita.marcarDestaque();
  }

  receita.atualizadoPor = req.user.id;
  await receita.save();

  res.status(200).json({
    success: true,
    message: receita.destaque ? 'Marcado como destaque' : 'Removido dos destaques',
    data: receita,
  });
});

/**
 * @desc    Cancelar receita
 * @route   PATCH /api/receitas/:id/cancelar
 * @access  Private (Admin)
 */
export const cancelarReceita = asyncHandler(async (req, res, next) => {
  const { motivo } = req.body;

  if (!motivo) {
    return next(new AppError('Motivo do cancelamento é obrigatório', 400));
  }

  const receita = await Receita.findById(req.params.id);

  if (!receita) {
    return next(new AppError('Receita não encontrada', 404));
  }

  await receita.cancelar(motivo);
  receita.atualizadoPor = req.user.id;
  await receita.save();

  res.status(200).json({
    success: true,
    message: 'Receita cancelada com sucesso',
    data: receita,
  });
});
