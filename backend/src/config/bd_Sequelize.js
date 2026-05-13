const Sequelize = require("sequelize");

// No SQLite, passamos apenas as configurações de dialect e storage (caminho do arquivo)
const conn = new Sequelize({
    dialect: "sqlite",
    storage: "./jacaridade.db", // O arquivo local do banco será criado aqui
    define: {
        timestamps: false
    }
});

conn.authenticate()
    .then(() => {
        console.log("Banco conectado");
    })
    .catch((erro) => {
        console.log("Banco não conectado: " + erro);
    });

module.exports = conn;