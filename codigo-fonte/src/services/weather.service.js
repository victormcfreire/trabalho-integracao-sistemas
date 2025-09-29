// Serviço que integra com API externa (Open-Meteo por padrão).
// Usa fetch nativo do Node 20+. Os parâmetros base vem das variáveis de ambiente.

const BASE_URL =
  process.env.EXTERNAL_API_URL || "https://api.open-meteo.com/v1/forecast";
const DEFAULT_LAT = process.env.DEFAULT_LAT || "-3.7319";
const DEFAULT_LON = process.env.DEFAULT_LON || "-38.5267";

/**
 * Busca clima atual aproximado usando Open-Meteo.
 */
export async function fetchClima(lat = DEFAULT_LAT, lon = DEFAULT_LON) {
  try {
    // Open-Meteo: pegamos temperatura do dia (hourly)
    const url = `${BASE_URL}?latitude=${encodeURIComponent(
      lat
    )}&longitude=${encodeURIComponent(
      lon
    )}&hourly=temperature_2m&current_weather=true`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Erro na API externa: ${res.status} ${res.statusText}`);
    }
    const clima = await res.json();
    if (!clima || !clima.current_weather) {
      throw new Error("Resposta da API externa não contém dados de clima válidos.");
    }
    return {
      status: clima.status,
      latitude: clima.latitude,
      longitude: clima.longitude,
      timezone: clima.timezone,
      elevation: clima.elevation,
      temperatura: clima.current_weather.temperature,
      temperatura_unidade: clima.current_weather_units?.temperature,
      tempo: clima.current_weather.time,
      vento: {
        velocidade: clima.current_weather.windspeed,
        direcao: clima.current_weather.winddirection,
        unidade: clima.current_weather_units?.windspeed,
      },
      codigo_clima: clima.current_weather.weathercode,
      is_dia: clima.current_weather.is_day === 1,
    };
  } catch (err) {
    const e = new Error(`Falha ao obter dados de clima: ${err.message}`);
    e.code = "WEATHER_FETCH_ERROR";
    throw e;
  }
}
