const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { validateJournal } = require('../middleware/validation');

router.get('/', journalController.getAllEntries);
router.get('/stats', journalController.getStats);
router.post('/', validateJournal, journalController.createEntry);
router.put('/:id', validateJournal, journalController.updateEntry);
router.delete('/:id', journalController.deleteEntry);

module.exports = router;
