const sqlite3 = require("sqlite3").verbose();

// O método Database já tenta fazer a conexão e cria o arquivo se ele não existir.
// Passamos o caminho do arquivo e a função de callback para capturar erros.
const db = new sqlite3.Database("./jacaridade.db", (erro) => {
    if (erro) {
        console.log("Deu ruim " + erro.message);
    } else {
        console.log("Banco Conectado");
    }
});

module.exports = db;