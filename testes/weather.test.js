import { fetchClima } from "../src/services/weather.service.js";

describe("fetchClima", () => {
  const mockResponse = {
    status: 200,
    latitude: -3.7319,
    longitude: -38.5267,
    timezone: "America/Fortaleza",
    elevation: 19,
    current_weather: {
      temperature: 28.5,
      time: "2024-06-01T12:00",
      windspeed: 10.2,
      winddirection: 180,
      weathercode: 1,
      is_day: 1,
    },
    current_weather_units: {
      temperature: "°C",
      windspeed: "km/h",
    },
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("deve retornar dados de clima com coordenadas padrão", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchClima();
    expect(result).toMatchObject({
      latitude: mockResponse.latitude,
      longitude: mockResponse.longitude,
      temperatura: mockResponse.current_weather.temperature,
      temperatura_unidade: mockResponse.current_weather_units.temperature,
      tempo: mockResponse.current_weather.time,
      vento: {
        velocidade: mockResponse.current_weather.windspeed,
        direcao: mockResponse.current_weather.winddirection,
        unidade: mockResponse.current_weather_units.windspeed,
      },
      codigo_clima: mockResponse.current_weather.weathercode,
      is_dia: true,
    });
  });

  it("deve usar coordenadas fornecidas", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockResponse, latitude: 10, longitude: 20 }),
    });

    const result = await fetchClima(10, 20);
    expect(result.latitude).toBe(10);
    expect(result.longitude).toBe(20);
  });

  it("deve lançar erro se a requisição falhar", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchClima()).rejects.toThrow(
      "Falha ao obter dados de clima: Network error"
    );
  });

  it("deve retornar erro se a resposta não for ok", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchClima()).rejects.toThrow(
      "Falha ao obter dados de clima: Erro na API externa: 500 Internal Server Error"
    );
  });

  it("deve lançar erro se a resposta não contiver dados de clima", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await expect(fetchClima()).rejects.toThrow(
      "Falha ao obter dados de clima: Resposta da API externa não contém dados de clima válidos."
    );
  });
});
