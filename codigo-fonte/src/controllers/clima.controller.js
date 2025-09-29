import { fetchClima } from "../services/weather.service.js";

/**
 * Controller para GET /clima
 * Retorna { status: 'ok', clima: { temperatura: XX } }
 */
export async function getClima(req, res) {
  try {
    const clima = await fetchClima();
    return res.json({ status: "ok", clima });
  } catch (err) {
    // Se falhar a API externa, ainda retornamos status com aviso
    return res.status(500).json({ status: "error", message: err.message });
  }
}
