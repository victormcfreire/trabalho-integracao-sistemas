import request from "supertest";
import app from "../src/app.js";
import { fetchClima } from "../src/services/weather.service.js";

jest.mock("../src/services/weather.service.js", () => ({
  fetchClima: jest.fn(() =>
    Promise.resolve({ temperatura: 25, descricao: "Ensolarado" })
  ),
}));

describe("GET /clima", () => {
  it("deve retornar status ok e objeto de clima", async () => {
    const res = await request(app).get("/clima");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("clima");
    expect(res.body.clima).toHaveProperty("temperatura");
  });
  it("deve retornar 500 se a API externar falhar", async() => {
    const { fetchCliima } = await import("../src/services/weather.service.js");
    fetchClima.mockImplementationOnce(() => Promise.reject(new Error("Falha na API externa")));

    const res = await request(app).get("/clima");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("status", "error");
  });
});
