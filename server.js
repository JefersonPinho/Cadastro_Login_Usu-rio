// Importando dependências
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());  // Habilitar CORS para todas as origens
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com o Banco de Dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistema_usuarios",
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados!");
});

// Rota para Cadastro
app.post("/register", async (req, res) => {
  const { nome, username, cpf, senha } = req.body;

  // Validação básica
  if (!nome || !username || !cpf || !senha) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  try {
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir no banco de dados
    const query = `INSERT INTO usuarios (nome, username, cpf, senha) VALUES (?, ?, ?, ?)`;
    db.query(query, [nome, username, cpf, hashedPassword], (err) => {
      if (err) {
        console.error("Erro ao cadastrar usuário:", err);
        return res.status(500).json({ message: "Erro ao cadastrar usuário." });
      }
      res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    });
  } catch (error) {
    console.error("Erro ao criptografar a senha:", error);
    res.status(500).json({ message: "Erro ao processar o cadastro." });
  }
});

// Rota para Login
app.post("/login", (req, res) => {
  const { username, senha } = req.body;

  // Buscar usuário no banco
  const query = `SELECT * FROM usuarios WHERE username = ?`;
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error("Erro ao buscar usuário:", err);
      return res.status(500).json({ message: "Erro interno." });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    const user = results[0];

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    res.status(200).json({ message: "Login realizado com sucesso!" });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
