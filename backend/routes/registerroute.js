const express = require('express');
const { registerUser, upload } = require('../controllers/registercontroller');

const router = express.Router();

// Register route with file upload handling
router.post('/register', upload.single('photo'), registerUser); // Use multer middleware

module.exports = router;
