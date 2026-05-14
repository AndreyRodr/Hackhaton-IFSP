const express = require('express');
const cors = require('cors');
const { addUser, loginUser, validarSenha } = require('./model/cadastroUser');
const { addOng, login: loginOng, validacao: validarSenhaOng } = require('./model/cadastroOng');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Porta padrão do Vite
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de Login Usuário
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const user = await loginUser(email);
        if (!user || !(await validarSenha(senha, user.senha))) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }
        res.json({ message: 'Login efetuado com sucesso', user: { nome: user.nome, tipo: 'user' } });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar login.' });
    }
});

// Rota de Login ONG
app.post('/api/login-ong', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const ong = await loginOng({ email });
        console.log(ong);
        
        if (!ong || !(await validarSenhaOng(senha, ong.senha))) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }
        res.json({ message: 'Login efetuado com sucesso', user: { nome: ong.nome, tipo: 'ong' } });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ error: 'Erro ao processar login da ONG.' });
    }
});

// Rota de Cadastro Usuário
app.post('/api/cadastro', async (req, res) => {
    const { nome, email, senha, interesses } = req.body;
    try {
        await addUser({ nome, email, senha, interesses });
        res.status(201).json({ message: 'Cadastro realizado com sucesso.' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        }
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
});

// Rota de Cadastro ONG
app.post('/api/cadastro-ong', async (req, res) => {
    const { nome, email, senha, categoria, descricao } = req.body;
    try {
        await addOng({ nome, email, senha, categoria, descricao, tipo_conta: 'ong' });
        res.status(201).json({ message: 'ONG cadastrada com sucesso.' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        }
        res.status(500).json({ error: 'Erro ao cadastrar ONG.' });
    }
});

module.exports = app;