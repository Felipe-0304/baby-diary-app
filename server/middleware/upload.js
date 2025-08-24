const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // agregar si usarás optimizeImage

// Configuración de almacenamiento mejorada
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    // Crear carpetas específicas por tipo de archivo
    if (file.mimetype.startsWith('image/')) {
      uploadPath = path.join(__dirname, '../uploads/images');
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = path.join(__dirname, '../uploads/videos');
    } else {
      uploadPath = path.join(__dirname, '../uploads/other');
    }

    // Crear carpeta si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const prefix = file.mimetype.startsWith('video/') ? 'video-' : 'image-';
    cb(null, prefix + uniqueSuffix + ext);
  }
});

// Filtro de archivos mejorado
const fileFilter = (req, file, cb) => {
  // Permitir imágenes y videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen y video'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB para videos e imágenes
  }
});

// Middleware para optimizar imágenes (opcional)
const optimizeImage = async (req, res, next) => {
  if (!req.file || !req.file.mimetype.startsWith('image/')) {
    return next();
  }

  try {
    const inputPath = req.file.path;
    const outputPath = inputPath.replace(path.extname(inputPath), '_optimized.jpg');

    await sharp(inputPath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    // Elimina la imagen original y usa la optimizada
    fs.unlinkSync(inputPath);
    req.file.path = outputPath;
    req.file.filename = path.basename(outputPath);

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, optimizeImage };
