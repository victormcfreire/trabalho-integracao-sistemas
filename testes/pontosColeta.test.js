import request from "supertest";
import app from "../src/app.js";

// Mock do Parse
jest.mock("../parseClient.js", () => ({
  Object: {
    extend: (className) => class {
      constructor() {}
      get(key) {
        if (key === "file") return { url: () => "http://fakeurl.com/file.geojson" };
        return null;
      }
    },
  },
  Query: jest.fn(() => ({
    equalTo: jest.fn().mockReturnThis(),
    first: jest.fn(() =>
      Promise.resolve({
        get: (key) => {
          return { url: () => "http://fakeurl.com/file.geojson" };
        },
      })
    ),
  })),
}));

// Mock do fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { id: 1 },
            geometry: { type: "Point", coordinates: [0, 0] },
          },
        ],
      }),
  })
);

describe("GET /pontos-coleta", () => {
  it("deve retornar 200 e o GeoJSON correto", async () => {
    const res = await request(app).get("/pontos-coleta").set("Authorization", "Bearer fakeToken");;

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("type", "FeatureCollection");
    expect(Array.isArray(res.body.features)).toBe(true);
    expect(res.body.features[0]).toHaveProperty("type", "Feature");
  });

  it("deve retornar 404 se não encontrar o arquivo", async () => {
    const { Query } = await import("../parseClient.js");
    Query.mockImplementationOnce(() => ({
      equalTo: jest.fn().mockReturnThis(),
      first: jest.fn(() => Promise.resolve(null)),
    }));

    const res = await request(app).get("/pontos-coleta").set("Authorization", "Bearer fakeToken");;
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Arquivo não encontrado");
  });

  it("deve retornar 500 em caso de erro no fetch", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error("Erro de rede"))
    );

    const res = await request(app).get("/pontos-coleta").set("Authorization", "Bearer fakeToken");;
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty(
      "error",
      "Erro ao carregar pontos de coleta"
    );
  });
});
