import express from "express";
import routes from "./routes/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.js";
import cors from "cors";

const app = express();

// Middleware para interpretar JSON no body
app.use(cors());
app.use(express.json());

// Rotas da API
// app.use("/", routes);

// // Documentação Swagger
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Adiciona a rota /error antes dos testes para garantir que ela existe
app.get("/error", (req, res) => {
  throw new Error("Erro teste");
});

app.get("/teste", (req, res) => {
  res.json({ status: "ok" });
});

// Middleware 404 para rotas inexistentes
// app.use((req, res) => {
//   res.status(404).json({ error: "Rota não encontrada" });
// });

// // Middleware de erro genérico (evita que erros quebrem a aplicação)
// app.use((err, req, res, next) => {
//   console.error("Erro interno:", err);
//   res.status(500).json({ error: "Erro interno do servidor" });
// });

export default app;
