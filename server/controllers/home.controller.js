/**
 * Controller de Home Content
 * @description Gerencia conteúdo da página inicial
 */

import HomeContent from '../models/HomeContent.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

/**
 * @desc    Obter conteúdo do home (público)
 * @route   GET /api/home
 * @access  Public
 */
export const getHomeContent = asyncHandler(async (req, res) => {
  let content = await HomeContent.findOne({ isPublished: true }).sort({ updatedAt: -1 });

  // Se não existir, criar conteúdo padrão
  if (!content) {
    content = await HomeContent.createDefault();
  }

  res.status(200).json({
    success: true,
    data: content,
  });
});

/**
 * @desc    Obter conteúdo do home (admin - inclui rascunhos)
 * @route   GET /api/home/admin
 * @access  Private (Admin)
 */
export const getHomeContentAdmin = asyncHandler(async (req, res) => {
  let content = await HomeContent.findOne().sort({ updatedAt: -1 });

  if (!content) {
    content = await HomeContent.createDefault();
  }

  res.status(200).json({
    success: true,
    data: content,
  });
});

/**
 * @desc    Atualizar conteúdo do home
 * @route   PUT /api/home
 * @access  Private (Admin)
 */
export const updateHomeContent = asyncHandler(async (req, res) => {
  let content = await HomeContent.findOne();

  if (!content) {
    content = await HomeContent.create({
      ...req.body,
      lastPublishedBy: req.user.id,
    });
  } else {
    // Merge dos dados
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        content[key] = req.body[key];
      }
    });

    content.lastPublishedBy = req.user.id;
    
    if (req.body.isPublished) {
      content.publishedAt = Date.now();
    }

    await content.save();
  }

  res.status(200).json({
    success: true,
    message: 'Conteúdo atualizado com sucesso',
    data: content,
  });
});

/**
 * @desc    Atualizar seção específica do home
 * @route   PATCH /api/home/:section
 * @access  Private (Admin)
 */
export const updateHomeSection = asyncHandler(async (req, res, next) => {
  const { section } = req.params;
  const validSections = [
    'hero',
    'about',
    'stats',
    'programs',
    'gallery',
    'testimonials',
    'howToHelp',
    'contact',
    'footer',
    'seo',
  ];

  if (!validSections.includes(section)) {
    return next(new AppError(`Seção '${section}' inválida`, 400));
  }

  let content = await HomeContent.findOne();

  if (!content) {
    content = await HomeContent.createDefault();
  }

  // Atualizar apenas a seção específica
  content[section] = {
    ...content[section],
    ...req.body,
  };

  content.lastPublishedBy = req.user.id;
  await content.save();

  res.status(200).json({
    success: true,
    message: `Seção '${section}' atualizada com sucesso`,
    data: content,
  });
});

/**
 * @desc    Adicionar item a uma lista (programs, testimonials, etc)
 * @route   POST /api/home/:section/add
 * @access  Private (Admin)
 */
export const addItemToSection = asyncHandler(async (req, res, next) => {
  const { section } = req.params;
  const validSections = ['stats', 'programs', 'testimonials'];

  if (!validSections.includes(section)) {
    return next(new AppError(`Não é possível adicionar itens à seção '${section}'`, 400));
  }

  let content = await HomeContent.findOne();

  if (!content) {
    content = await HomeContent.createDefault();
  }

  // Adicionar novo item
  if (!Array.isArray(content[section])) {
    content[section] = [];
  }

  content[section].push(req.body);
  content.lastPublishedBy = req.user.id;
  await content.save();

  res.status(201).json({
    success: true,
    message: `Item adicionado à seção '${section}' com sucesso`,
    data: content,
  });
});

/**
 * @desc    Remover item de uma lista
 * @route   DELETE /api/home/:section/:itemId
 * @access  Private (Admin)
 */
export const removeItemFromSection = asyncHandler(async (req, res, next) => {
  const { section, itemId } = req.params;

  const content = await HomeContent.findOne();

  if (!content) {
    return next(new AppError('Conteúdo não encontrado', 404));
  }

  if (!Array.isArray(content[section])) {
    return next(new AppError(`Seção '${section}' não é uma lista`, 400));
  }

  // Remover item pelo _id
  content[section] = content[section].filter((item) => item._id.toString() !== itemId);

  content.lastPublishedBy = req.user.id;
  await content.save();

  res.status(200).json({
    success: true,
    message: 'Item removido com sucesso',
    data: content,
  });
});

/**
 * @desc    Publicar/despublicar conteúdo
 * @route   PATCH /api/home/publish
 * @access  Private (Admin)
 */
export const togglePublish = asyncHandler(async (req, res, next) => {
  const { isPublished } = req.body;

  const content = await HomeContent.findOne();

  if (!content) {
    return next(new AppError('Conteúdo não encontrado', 404));
  }

  content.isPublished = isPublished;
  
  if (isPublished) {
    content.publishedAt = Date.now();
  }

  content.lastPublishedBy = req.user.id;
  await content.save();

  res.status(200).json({
    success: true,
    message: isPublished ? 'Conteúdo publicado' : 'Conteúdo despublicado',
    data: content,
  });
});
