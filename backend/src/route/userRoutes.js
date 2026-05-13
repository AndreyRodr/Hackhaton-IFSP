const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

router.get('/cadastro-usuario', userController.cadastroPage);
router.post('/cadastro-usuario', userController.cadastrar);
router.get('/login-usuario', userController.loginPage);
router.post('/login-usuario', userController.autenticar);
