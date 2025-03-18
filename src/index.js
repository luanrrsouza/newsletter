import express, { urlencoded } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(urlencoded({ extended: true }));

// configuração do ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/cadastro", (request, response) => {
  response.render("form");
});

app.post("/register", async (request, response) => {
  try {
    const { username, email } = request.body;

    const newUser = await prisma.user.create({ data: { username, email } });

    response.redirect("/registeredUsers");
  } catch (error) {
    console.error("Erro ao se cadastrar na newsletter:", error);
    response
      .status(404)
      .json({ message: "Erro ao se registrar na newsletter" });
  }
});

app.get("/registeredUsers", async (request, response) => {
  try {
    const users = await prisma.user.findMany();
    response.render("users", { users });
  } catch (error) {
    console.error("Erro ao listar os usuários:", error);
    response.status(404).json({ message: "Erro ao listar usuários" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta:${PORT}`);
});
