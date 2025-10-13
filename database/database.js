// Cria acesso ao banco de dados SQL para administrar
const Sequelize = require("sequelize");

// Faz conexão com o banco SQL
const connection = new Sequelize("guiaperguntas", "root", "3020", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
