const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
const router = express.Router();

// Rota para cadastro de usuário
router.post('/signup', userController.signUp);

// Rota para autenticação de usuário
router.post('/signin', userController.signIn);

// Rota para buscar informações do usuário
router.get('/user', authenticateToken, userController.getUser);


module.exports = router;
