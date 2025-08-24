const Joi = require('joi');

const memorySchema = Joi.object({
  title: Joi.string().required().max(200),
  text: Joi.string().required().max(2000),
  date: Joi.date().required(),
  category: Joi.string().valid('Hitos', 'Fotos', 'Videos', 'Médico', 'Emocional', 'Síntomas').required(),
  mood: Joi.string().valid('Feliz', 'Neutral', 'Triste', 'Emocionado', 'Ansioso').optional(),
  location: Joi.string().optional().allow(''),
  tags: Joi.array().items(Joi.string()).optional(),
  isFavorite: Joi.boolean().optional(),
  weather: Joi.string().optional().allow('')
});

const journalSchema = Joi.object({
  title: Joi.string().required().max(200),
  text: Joi.string().required().max(5000),
  date: Joi.date().required(),
  mood: Joi.string().valid('Feliz', 'Neutral', 'Triste', 'Emocionado', 'Ansioso', 'Cansado').optional(),
  energy: Joi.number().integer().min(1).max(10).optional(),
  symptoms: Joi.array().items(Joi.string()).optional(),
  gratitude: Joi.string().optional().allow(''),
  tags: Joi.array().items(Joi.string()).optional(),
  isPrivate: Joi.boolean().optional()
});

const taskSchema = Joi.object({
  text: Joi.string().required().max(500),
  category: Joi.string().valid('General', 'Compras', 'Preparativos', 'Médico', 'Decisiones', 'Educación').optional(),
  dueDate: Joi.date().optional().allow(null),
  priority: Joi.string().valid('Baja', 'Media', 'Alta').optional(),
  notes: Joi.string().optional().allow(''),
  estimatedCost: Joi.number().min(0).optional()
});

const appointmentSchema = Joi.object({
  title: Joi.string().required().max(200),
  date: Joi.date().required(),
  doctor: Joi.string().optional().allow(''),
  location: Joi.string().optional().allow(''),
  type: Joi.string().valid('Médico', 'Ecografía', 'Análisis', 'Control', 'Emergencia').optional(),
  notes: Joi.string().optional().allow(''),
  reminder: Joi.boolean().optional()
});

const medicalRecordSchema = Joi.object({
  date: Joi.date().required(),
  type: Joi.string().valid('Peso', 'Presión arterial', 'Glucosa', 'Hemoglobina', 'Ecografía', 'Otro').required(),
  value: Joi.string().required(),
  unit: Joi.string().optional().allow(''),
  notes: Joi.string().optional().allow(''),
  week: Joi.number().integer().min(1).max(42).optional(),
  isNormal: Joi.boolean().optional()
});

const validateMemory = (req, res, next) => {
  const { error } = memorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos de memoria inválidos',
      details: error.details[0].message
    });
  }
  next();
};

const validateJournal = (req, res, next) => {
  const { error } = journalSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos de entrada de diario inválidos',
      details: error.details[0].message
    });
  }
  next();
};

const validateTask = (req, res, next) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos de tarea inválidos',
      details: error.details[0].message
    });
  }
  next();
};

const validateAppointment = (req, res, next) => {
  const { error } = appointmentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos de cita inválidos',
      details: error.details[0].message
    });
  }
  next();
};

const validateMedicalRecord = (req, res, next) => {
  const { error } = medicalRecordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Datos de registro médico inválidos',
      details: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateMemory,
  validateJournal,
  validateTask,
  validateAppointment,
  validateMedicalRecord
};
