const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Rota para cadastro de usuário
router.post('/signup', userController.signUp);

module.exports = router;
