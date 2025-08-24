const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config/config');

const memoryRoutes = require('./routes/memories');
const journalRoutes = require('./routes/journal');
const taskRoutes = require('./routes/tasks');
const appointmentRoutes = require('./routes/appointments');
const medicalRoutes = require('./routes/medical');
const settingsRoutes = require('./routes/settings');

const app = express();

// ✅ CORRECCIÓN: Configurar trust proxy ANTES del rate limiting
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

// ✅ CORRECCIÓN: Rate limiter mejorado con configuración completa
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana de tiempo
  message: {
    error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
    retryAfter: 15 * 60 // segundos hasta poder reintentar
  },
  standardHeaders: true, // Retorna rate limit info en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita los headers `X-RateLimit-*`
  // ✅ Opcional: Configurar skipSuccessfulRequests para desarrollo
  skipSuccessfulRequests: process.env.NODE_ENV === 'development',
  // ✅ Handler personalizado para mejor logging
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit excedido para IP: ${req.ip}`);
    res.status(429).json({
      error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
      retryAfter: Math.round(limiter.windowMs / 1000)
    });
  }
});

app.use('/api/', limiter);

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas API
app.use('/api/memories', memoryRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/settings', settingsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// ✅ MEJORADO: Error handler más robusto
app.use((err, req, res, next) => {
  console.error('❌ Error del servidor:', err.stack);
  
  // Errores específicos
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: 'El archivo es demasiado grande',
      maxSize: '10MB'
    });
  }
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'JSON inválido en la petición'
    });
  }
  
  // Error genérico
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

module.exports = app;
