import Parse from "../../parseClient.js";

/**
 * Controller para GET /pontos-coleta.
 * Retorna um GeoJSON FeatureCollection com pontos de coleta.
 */
export async function getPontosColeta(req, res) {
  try {
    const sessionToken = req.headers.authorization;
    if (!sessionToken) {
      return res.status(400).json({ error: "Usuário não autenticado!" });
    }
    const Maps = Parse.Object.extend("Maps");
    const query = new Parse.Query(Maps);
    query.equalTo("Nome", "Pontos de Coleta");
    const mapObject = await query.first({ useMasterKey: true});

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

    return res.json(geoJSON);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao carregar pontos de coleta" });
  }
}
