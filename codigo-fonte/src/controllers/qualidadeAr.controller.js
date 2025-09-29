const API_KEY =
  process.env.OPENAQ_API_KEY;

/**
 * Controller para GET /qualidade-ar
 * Retorna { status: 'ok', qualidade_ar: { indice: XX, poluente: YY } }
 */

export async function getQualidadeAr(req, res) {
  try {
    // Chamada à OpenAQ
    const apiUrl = `https://api.waqi.info/feed/@-562120/?token=${API_KEY}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(502).json({ error: "Erro ao consultar OpenAQ" });
    }

    const data = await response.json();
    // Extrair o que for relevante
    const result = {
        indiceQualidadeAr: data.data.aqi,
        latitude: data.data.city.geo[0],
        longitude: data.data.city.geo[1],
        rua: data.data.city.name,
        localizacao: data.data.city.location,
        estacao: data.data.city.url,
        poluenteDominante: data.data.dominentpol,
        iaqi: data.data.iaqi,
    };

    return res.json(result);
  } catch (err) {
    console.error("Erro em /qualidade-ar:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
