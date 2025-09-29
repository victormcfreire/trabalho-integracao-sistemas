import request from "supertest";
import app from "../src/app.js";

// Mock do Parse
jest.mock("../parseClient.js", () => ({
  Object: {
    extend: (className) =>
      class {
        constructor() {}
        get(key) {
          if (key === "file")
            return { url: () => "http://fakeurl.com/file.geojson" };
          return null;
        }
      },
  },
  Query: jest.fn(() => ({
    equalTo: jest.fn().mockReturnThis(),
    first: jest.fn(() =>
      Promise.resolve({
        get: (key) => ({ url: () => "http://fakeurl.com/turnos.geojson" }),
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
            properties: { Turno: "DIURNO" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [0, 0],
                  [1, 0],
                  [1, 1],
                  [0, 1],
                  [0, 0],
                ],
              ],
            },
          },
          {
            type: "Feature",
            properties: { Turno: "NOTURNO" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [2, 2],
                  [3, 2],
                  [3, 3],
                  [2, 3],
                  [2, 2],
                ],
              ],
            },
          },
        ],
      }),
  })
);

describe("GET /turnos-coleta", () => {
  it("deve retornar todos os turnos quando não houver filtro", async () => {
    const res = await request(app).get("/turnos-coleta").set("Authorization", "Bearer fakeToken");;

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("type", "FeatureCollection");
    expect(res.body.features.length).toBe(2);
  });

  it("deve filtrar por turno e retornar somente o turno especificado", async () => {
    const res = await request(app).get("/turnos-coleta?turno=NOTURNO").set("Authorization", "Bearer fakeToken");;
    expect(res.status).toBe(200);
    expect(
      res.body.features.every((f) => f.properties.Turno === "NOTURNO")
    ).toBe(true);
  });

  it("deve retornar 404 se nenhum turno for encontrado", async () => {
    const turno = "Inexistente";
    const res = await request(app).get(`/turnos-coleta?turno=${turno}`).set("Authorization", "Bearer fakeToken");;

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty(
      "error",
      `Nenhum turno encontrado para '${turno}'.`
    );
  });

  it("deve retornar 404 se o arquivo não for encontrado", async () => {
    const Parse = require("../parseClient.js");
    Parse.Query.mockImplementationOnce(() => {
      return {
        equalTo: jest.fn().mockReturnThis(),
        first: jest.fn(() => Promise.resolve(null)),
      };
    });

    const res = await request(app).get("/turnos-coleta").set("Authorization", "Bearer fakeToken");;
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Arquivo não encontrado");
  });
});
