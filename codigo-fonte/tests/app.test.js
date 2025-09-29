import request from "supertest";
import app from "../src/app.js";

describe("App.js API", () => {
  it("deve retornar 404 para rota desconhecida", async () => {
    const res = await request(app).get("/rota-desconhecida");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Rota não encontrada" });
  });

  it("deve servir a documentação Swagger em /docs", async () => {
    const res = await request(app).get("/docs").redirects(1);
    expect(res.status).toBe(200);
    expect(res.text).toContain("Swagger UI");
  });

  it("deve lidar com erros internos do servidor", async () => {
    const res = await request(app).get("/error");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Erro interno do servidor" });
  });
});
