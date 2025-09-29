// Serviço utilitário para ler arquivos GeoJSON de forma assíncrona.
import { readFile } from "fs/promises";
import path from "path";

const dataDir = path.resolve("data");

/**
 * Lê um arquivo JSON/GeoJSON de forma assíncrona e o parseia.
 * Retorna um objeto JavaScript ou lança erro em caso de falha.
 */
export async function readGeoJSON(filename) {
  try {
    const filePath = path.join(dataDir, filename);
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    // Re-lança com mensagem mais clara
    const e = new Error(
      `Falha ao ler arquivo GeoJSON '${filename}': ${err.message}`
    );
    e.code = "GEOJSON_READ_ERROR";
    throw e;
  }
}
