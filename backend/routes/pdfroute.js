const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfcontroller');

// Route to generate and serve a PDF
router.post('/generate', pdfController.generatePDF);

module.exports = router;
