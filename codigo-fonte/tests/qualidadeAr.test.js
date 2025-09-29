import request from "supertest";
import app from "../src/app.js";

// Mock da fetch para simular resposta da API externa
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("GET /qualidade-ar", () => {
  it("deve retornar dados da qualidade do ar quando a API responder ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          aqi: 50,
          city: {
            geo: [-23.5, -46.6],
            name: "São Paulo",
            location: "Centro",
            url: "https://waqi.info",
          },
          dominentpol: "pm25",
          iaqi: { pm25: { v: 10 } },
        },
      }),
    });

    const res = await request(app).get("/qualidade-ar");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("indiceQualidadeAr", 50);
    expect(res.body).toHaveProperty("rua", "São Paulo");
  });

  it("deve retornar 502 se a API externa responder com erro", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Error",
    });
    const res = await request(app).get("/qualidade-ar");
    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty("error");
  });
});
