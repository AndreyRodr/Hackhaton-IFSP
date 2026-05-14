const express = require('express');
const cors = require('cors');
const { addUser, loginUser, validarSenha, User } = require('./model/cadastroUser');
const { addOng, login: loginOng, valnomeacao: validarSenhaOng, Ong } = require('./model/cadastroOng');

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
        const ong = await loginOng(email);
        if (!ong || !(await validarSenhaOng(senha, ong.senha))) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }
        res.json({ message: 'Login efetuado com sucesso', user: { id: ong.id, nome: ong.nome, email: ong.email, tipo: 'ong' } });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao processar login da ONG.' });
    }
});

// Rota para obter perfil de usuário pelo ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'nome', 'email', 'tipo_conta', 'interesses']
        });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
        res.json({ user: { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo_conta, interesses: user.interesses } });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
});

// Rota para obter perfil de ONG pelo ID
app.get('/api/ongs/:id', async (req, res) => {
    try {
        const ong = await Ong.findByPk(req.params.id, {
            attributes: ['id', 'nome', 'email', 'categoria', 'descricao', 'tipo_conta']
        });
        if (!ong) return res.status(404).json({ error: 'ONG não encontrada.' });
        res.json({ ong: { id: ong.id, nome: ong.nome, email: ong.email, categoria: ong.categoria, descricao: ong.descricao, tipo: ong.tipo_conta } });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ONG.' });
    }
});

// Atualizar perfil de usuário pelo ID
app.put('/api/users/:id', async (req, res) => {
    const { nome, interesses, email } = req.body;
    try {
        const [updated] = await User.update({ nome, interesses, email }, { where: { id: req.params.id } });
        if (!updated) return res.status(404).json({ error: 'Usuário não encontrado.' });
        const user = await User.findByPk(req.params.id, { attributes: ['id', 'nome', 'email', 'tipo_conta', 'interesses'] });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
});

// Atualizar perfil de ONG pelo ID
app.put('/api/ongs/:id', async (req, res) => {
    const { nome, categoria, descricao, email } = req.body;
    try {
        const [updated] = await Ong.update({ nome, categoria, descricao, email }, { where: { id: req.params.id } });
        if (!updated) return res.status(404).json({ error: 'ONG não encontrada.' });
        const ong = await Ong.findByPk(req.params.id, { attributes: ['id', 'nome', 'email', 'categoria', 'descricao', 'tipo_conta'] });
        res.json({ ong });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar ONG.' });
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