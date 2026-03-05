const express = require('express');
const router = express.Router();
const formulaController = require('../controllers/formulaControllers');

router.post('/optimize', formulaController.optimize);
router.post('/analyze', formulaController.analyze);

module.exports = router;
