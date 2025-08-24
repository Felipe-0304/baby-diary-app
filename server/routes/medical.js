const express = require('express');
const router = express.Router();
const medicalController = require('../controllers/medicalController');
const { validateMedicalRecord } = require('../middleware/validation');

router.get('/', medicalController.getAllRecords);
router.get('/type/:type', medicalController.getByType);
router.post('/', validateMedicalRecord, medicalController.createRecord);
router.put('/:id', validateMedicalRecord, medicalController.updateRecord);
router.delete('/:id', medicalController.deleteRecord);

module.exports = router;
