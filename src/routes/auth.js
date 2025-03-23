const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

module.exports = router; 