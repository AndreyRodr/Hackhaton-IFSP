const express = require('express');
const router = express.Router();
const ongController = require('../controller/OngController');

router.get('/cadastro-ong', ongController.cadastroPage);
router.post('/cadastro-ong', ongController.cadastrar);
router.get('/login-ong', ongController.loginPage);
router.post('/login-ong', ongController.autenticar);
