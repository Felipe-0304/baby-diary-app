const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { validateAppointment } = require('../middleware/validation');

router.get('/', appointmentController.getAllAppointments);
router.get('/upcoming', appointmentController.getUpcoming);
router.post('/', validateAppointment, appointmentController.createAppointment);
router.put('/:id', validateAppointment, appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
