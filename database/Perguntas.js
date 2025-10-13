// Faz o prossedimento de conexão com o banco SQL
const Sequelize = require("sequelize");
const connection = require("./database");

// Cria uma tabela e define propriedades
const Pergunta = connection.define("perguntas", {
  // STRING textos curtos
  // TEXT textos longos
  // allowNull proibe campos vazios
  // INTEGER para números inteiros
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

// Envia os dados para o banco de dados e retorna uma tabela criada
// ou uma linha de dados na tabela.

// * force: false = verifica se existe, se acaso existe pode criar um novo se
// for colocado como TRUE

Pergunta.sync({ force: false }).then(() => {
  console.log("Tabela criada!");
});

module.exports = Pergunta;
