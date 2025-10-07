/**
 * Middleware de Upload de Arquivos
 * @description Configuração do Multer para upload de imagens
 */

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppError } from './errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/assets/images');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp-nome-original.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '');
    
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new AppError('Apenas imagens são permitidas (JPEG, PNG, GIF, WebP)', 400));
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB padrão
  },
  fileFilter: fileFilter,
});

// Exports para diferentes tipos de upload
export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 10);
export const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 20 },
]);

export default upload;
