const express = require("express");
const app = express();

const bodyParser = require("body-parser");

const connection = require("./database/database");
const Pergunta = require("./database/Perguntas");
const Resposta = require("./database/Pergunta");

// Fazendo conexão com o banco de dados
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com sucesso ao banco de dados");
  })
  .catch((err) => {
    console.log('Erro ao conectar com DB:', err);
    process.exit(1)
  });

// Estou dizendo para o Express usar o EJS como view engine
app.set("view engine", "ejs");

// Para rodar arquivos estáticos
app.use(express.static("public"));

// Traduzir dados enviados pelo formulario de forma que seja
// utilizavel no javascript.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const namePage = "inicio";
  // 1° Faço uma listagem de todos os itens da tabela do Banco usando findAll
  // Também filtra a tabela em ordem de criação, pelo id.
  // 2° Defino raw: true para retornar apenas informações da tabela
  // 3° Crio uma condição com paramentro para cada item e retorna uma lista
  // 4° Final retorno uma lista json
  // DESC - decrescente || ESC - crescente
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((perguntas) => {
    res.render("index", {
      perg: namePage,
      perguntas: perguntas,
    });
  });
});

app.get("/perguntas", (req, res) => {
  const namePage = "Perguntas";
  res.render("perguntas", {
    perg: namePage,
  });
});

app.get("/pergunta/:id", (req, res) => {
  const namePage = "Perguntas";
  const id = req.params.id;

  // Metodo que retorna um dado com uma condição na tabela
  // busca o id relativo
  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta != undefined) {
      // Item encontado
      // também carrega todas as repostas relacionada
      // ao id da pergunta
      Resposta.findAll({
        where: { perguntaId: id },
        raw: true,
        order: [["id", "DESC"]],
      }).then((respostas) => {
        res.render("pergunta", {
          perg: namePage,
          title: pergunta.titulo,
          msg: pergunta.descricao,
          id: pergunta.id,
          respostas: respostas,
        });
      });
    } else {
      // Item não encontrado

      res.redirect("/");
    }
  });
});

app.post("/salvarpergunta", (req, res) => {
  const titulo = req.body.titulo;
  const desc = req.body.descricao;



  Pergunta.create({ titulo: titulo, descricao: desc })
    .then(() => {
      console.log("Pergunta enviada!");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("error");
    });
});

app.post("/enviarresposta/:id", (req, res) => {
  const id = req.params.id;
  const corpo = req.body.resp;

  Resposta.create({ corpo: corpo, perguntaId: id }).then(() => {
    console.log("Pergunta enviada!");
    res.redirect("/pergunta/" + id);
  });
});

app.get("/error", (req, res) => {
  res.render("error");
});

process.on("uncaughtException", (err) => {
  console.error("Erro não tratado:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Promise rejeitada não tratada:", reason);
});

app.listen(8080, () => {
  console.log("Site rodando!");
});
