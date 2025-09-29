import Parse from "../../parseClient.js";

/**
 * Controller para GET /turnos-coleta.
 * Aceita query optional `?turno=DIURNO|NOTURNO` para filtrar as features.
 */
export async function getTurnosColeta(req, res) {
  try {
    const sessionToken = req.headers.authorization;
    if (!sessionToken) {
      return res.status(400).json({ error: "Usuário não autenticado!" });
    }
    const { turno } = req.query;
    const Maps = Parse.Object.extend("Maps");
    const query = new Parse.Query(Maps);
    query.equalTo("Nome", "Turnos de Coleta");
    const mapObject = await query.first({ useMasterKey: true });

    if (!mapObject) {
      return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    const file = mapObject.get("GeoJSON");
    if (!file) {
      return res.status(500).json({ error: "Campo 'GeoJSON' não encontrado" });
    }

    const fileUrl = file.url();
    const response = await fetch(fileUrl);
    const geoJSON = await response.json();

    if (turno) {
      const filtered = {
        type: "FeatureCollection",
        features: geoJSON.features.filter(
          (f) =>
            String(f.properties?.Turno).toLowerCase() ===
            String(turno).toLowerCase()
        ),
      };
      if (filtered.features.length === 0) {
        return res
          .status(404)
          .json({ error: `Nenhum turno encontrado para '${turno}'.` });
      }
      return res.json(filtered);
    }

    return res.json(geoJSON);
  } catch (err) {
    console.error(err);
    if (err.code === "GEOJSON_READ_ERROR") {
      return res.status(500).json({ error: err.message });
    }
    return res
      .status(500)
      .json({ error: "Erro desconhecido ao carregar turnos de coleta." });
  }
}
