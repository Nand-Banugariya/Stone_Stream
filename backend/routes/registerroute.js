const express = require('express');
const { registerUser, upload } = require('../controllers/registercontroller');
const router = express.Router();

// Register route
router.post('/register', upload.single('photo'), registerUser);

module.exports = router;
