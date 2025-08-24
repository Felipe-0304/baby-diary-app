const express = require('express');
const router = express.Router();

const memoryController = require('../controllers/memoryController');
const { upload, optimizeImage } = require('../middleware/upload');
const { validateMemory } = require('../middleware/validation');

router.get('/', memoryController.getAllMemories);
router.get('/stats', memoryController.getStats);

// Para subir imágenes o videos, usa upload.single('image') si solo se permite una imagen,
// Si quieres admitir también videos, considera uploadMultiple o cambiar el campo según formulario.
router.post('/', upload.single('image'), optimizeImage, validateMemory, memoryController.createMemory);
router.put('/:id', upload.single('image'), optimizeImage, validateMemory, memoryController.updateMemory);
router.delete('/:id', memoryController.deleteMemory);

module.exports = router;
