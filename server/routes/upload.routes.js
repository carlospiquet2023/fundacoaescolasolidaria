/**
 * Rotas de Upload
 * @description Endpoints para upload de imagens
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle, uploadMultiple } from '../middleware/upload.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Upload de imagem única
 * @route   POST /api/upload/single
 * @access  Private (Admin)
 */
router.post(
  '/single',
  protect,
  authorize('admin', 'editor'),
  uploadSingle,
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next(new AppError('Nenhum arquivo foi enviado', 400));
    }

    const fileUrl = `/assets/images/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Imagem enviada com sucesso',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  })
);

/**
 * @desc    Upload de múltiplas imagens
 * @route   POST /api/upload/multiple
 * @access  Private (Admin)
 */
router.post(
  '/multiple',
  protect,
  authorize('admin', 'editor'),
  uploadMultiple,
  asyncHandler(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next(new AppError('Nenhum arquivo foi enviado', 400));
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/assets/images/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.status(200).json({
      success: true,
      message: `${files.length} imagens enviadas com sucesso`,
      data: files,
    });
  })
);

/**
 * @desc    Listar imagens
 * @route   GET /api/upload/images
 * @access  Private (Admin)
 */
router.get(
  '/images',
  protect,
  authorize('admin', 'editor'),
  asyncHandler(async (req, res, next) => {
    const imagesDir = path.join(__dirname, '../../public/assets/images');

    try {
      const files = await fs.readdir(imagesDir);
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      );

      const images = await Promise.all(
        imageFiles.map(async (file) => {
          const filePath = path.join(imagesDir, file);
          const stats = await fs.stat(filePath);

          return {
            filename: file,
            url: `/assets/images/${file}`,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
          };
        })
      );

      // Ordenar por data de modificação (mais recentes primeiro)
      images.sort((a, b) => b.modified - a.modified);

      res.status(200).json({
        success: true,
        data: images,
        total: images.length,
      });
    } catch (error) {
      // Log error for debugging
      return next(new AppError('Erro ao listar imagens: ' + error.message, 500));
    }
  })
);

/**
 * @desc    Deletar imagem
 * @route   DELETE /api/upload/images/:filename
 * @access  Private (Admin)
 */
router.delete(
  '/images/:filename',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res, next) => {
    const { filename } = req.params;
    const filePath = path.join(
      __dirname,
      '../../public/assets/images',
      filename
    );

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);

      res.status(200).json({
        success: true,
        message: 'Imagem deletada com sucesso',
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return next(new AppError('Imagem não encontrada', 404));
      }
      return next(new AppError('Erro ao deletar imagem', 500));
    }
  })
);

export default router;
