const Sequelize = require('sequelize');
const db = require('../config/bd_Sequelize');
const cripto = require('bcrypt');

const Ong = db.define('cadastroOng', {
  nome: {
    type: Sequelize.STRING,
    allowNull: false
  },
  categoria: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tipo_conta: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

Ong.beforeCreate(async (ong) => {
    ong.senha = await cripto.hash(ong.senha, 8);
});

Ong.sync();

const TodosOng = () => Ong.findAll({
    where: { tipo_conta: 'ong' }
});

const addOng = async (params) => 
    await Ong.create(params);

const buscar_nome = async (nome) => await Ong.findOne({
    where: { nome }
});

const atualizarOng = async(params) => {
    const senha_cripto = await cripto.hash(params.senha, 8);
    return await Ong.update(
        {
            senha: senha_cripto,
            email: params.email,
            nome: params.nome,
            categoria: params.categoria,
            descricao: params.descricao
        },
        {
            where: {
                nome: params.nome
            }
        }
    );
};

const deleteOng = async(nome) => {
    await Ong.destroy({
        where: {
            nome: nome
        }
    });
};

const login = async (email) => 
    await Ong.findOne({ where: { email } });

const valnomeacao = (senha, hash) => 
    cripto.compare(senha, hash);

module.exports = { TodosOng, addOng, buscar_nome, deleteOng, atualizarOng, login, valnomeacao, Ong };
