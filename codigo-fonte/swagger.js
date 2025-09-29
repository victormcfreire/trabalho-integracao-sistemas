import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Coletas de Lixo",
      version: "1.0.0",
      description: "Documentação Swagger para a API de coletas de lixo",
    },
  },
  // Paths manualmente definidos aqui para simplificar
  apis: ["./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

// Complementamos manualmente as rotas e exemplos
swaggerSpec.paths = {
  "/register": {
    post: {
      summary: "Registra um novo usuário",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string", example: "usuario_exemplo" },
                password: { type: "string", example: "senha123" },
                email: {
                  type: "string",
                  format: "email",
                  example: "usuario@example.com",
                },
              },
            },
          },
        },
        example: {
          username: "usuario_novo",
          password: "senha123",
          email: "usuarionovo@example.com",
        },
      },
      responses: {
        201: {
          description: "Usuário registrado com sucesso",
          content: {
            "application/json": {
              example: {
                message: "Usuário registrado com sucesso",
                user: {
                  id: "1",
                  username: "usuario_novo",
                  email: "usuarionovo@example.com",
                },
              },
            },
          },
        },
        400: {
          description: "Requisição inválida",
          content: {
            "application/json": {
              example: {
                error: "Usuário, senha e email são obrigatórios",
              },
            },
          },
        },
        500: {
          description: "Erro ao registrar usuário",
          content: {
            "application/json": {
              example: {
                error: "Erro desconhecido ao registrar usuário",
              },
            },
          },
        },
      },
    },
  },
  "/login": {
    post: {
      summary: "Realiza login de um usuário",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string" },
                password: { type: "string", format: "password" },
                email: { type: "string", format: "email" },
              },
              required: ["username", "password", "email"],
              additionalProperties: false,
            },
            example: {
              username: "usuario_novo",
              password: "senha123",
              email: "usuarionovo@example.com",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login realizado com sucesso",
          content: {
            "application/json": {
              example: {
                message: "Login realizado com sucesso",
                user: {
                  id: "1",
                  username: "usuario_novo",
                  email: "usuarionovo@example.com",
                },
              },
            },
          },
        },
        400: {
          description: "Requisição inválida",
          content: {
            "application/json": {
              example: { error: "Usuário e senha são obrigatórios" },
              required: ["username", "password"],
              additionalProperties: false,
            },
          },
        },
        401: {
          description: "Credenciais inválidas",
          content: {
            "application/json": {
              example: { error: "Login falhou" },
            },
          },
        },
        500: {
          description: "Erro ao realizar login",
          content: {
            "application/json": {
              example: { error: "Erro desconhecido ao realizar login." },
            },
          },
        },
      },
    },
  },
  "/logout": {
    post: {
      summary: "Realiza logout do usuário atual",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Logout realizado com sucesso",
          content: {
            "application/json": {
              example: { message: "Logout realizado com sucesso" },
            },
          },
        },
        401: {
          description: "Usuário não autenticado",
          content: {
            "application/json": {
              example: { error: "Usuário não autenticado" },
            },
          },
        },
        500: {
          description: "Erro ao realizar logout",
          content: {
            "application/json": {
              example: { error: "Erro desconhecido ao realizar logout." },
            },
          },
        },
      },
    },
  },
  "/pontos-coleta": {
    get: {
      summary: "Retorna pontos de coleta (GeoJSON FeatureCollection)",
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "FeatureCollection com pontos de coleta",
          content: {
            "application/json": {
              example: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: {
                      id: 1,
                      nome: "Ponto de Coleta A",
                      tipo: "orgânico",
                    },
                    geometry: {
                      type: "Point",
                      coordinates: [-38.5267, -3.7319],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
  "/qualidade-ar": {
    get: {
      summary: "Retorna dados de qualidade do ar para a cidade de Fortaleza",
      responses: {
        200: {
          description: "Dados de qualidade do ar",
          content: {
            "application/json": {
              example: {
                indiceQualidadeAr: 28,
                latitude: -3.73382389372,
                longitude: -38.49113380914,
                rua: "Rua Professor Dias da Rocha",
                localizacao:
                  "Edifício Gênova, 482, Rua Professor Dias da Rocha, Meireles, Fortaleza, Região Geográfica Imediata de Fortaleza, Região Geográfica Intermediária de Fortaleza, Ceará, Northeast Region, 60170-310, Brazil",
                estacao: "https://aqicn.org/station/@562120",
                poluenteDominante: "pm25",
                iaqi: { pm10: { v: 18 }, pm25: { v: 28 } },
              },
            },
          },
        },
        401: {
          description: "Token de autenticação inválido ou ausente",
        },
      },
    },
  },
  "/turnos-coleta": {
    get: {
      summary:
        "Retorna turnos de coleta (GeoJSON). Optional query ?turno=DIURNO|NOTURNO",
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: "turno",
          in: "query",
          description: "Filtro opcional para o turno de coleta",
          required: false,
          schema: {
            type: "string",
            enum: ["DIURNO", "NOTURNO"],
            default: "DIURNO",
          },
        },
      ],
      responses: {
        200: {
          description: "FeatureCollection (GEOJSON) com turnos de coleta",
          content: {
            "application/json": {
              example: {
                type: "Feature",
                id: "vw_ColetaDomiciliar.fid-76b6a887_199165f4123_e3e",
                geometry: {
                  type: "MultiPolygon",
                  coordinates: [
                    [
                      [
                        [-38.59522713, -3.77811446, 0],
                        [-38.59517741, -3.77730618, 0],
                        [-38.59263809, -3.77797648, 0],
                        [-38.58822168, -3.77916191, 0],
                        [-38.5888074, -3.78144662, 0],
                        [-38.58193626, -3.78336018, 0],
                        [-38.58455195, -3.7867253, 0],
                        [-38.58869606, -3.79088129, 0],
                        [-38.58967264, -3.78859585, 0],
                        [-38.59039786, -3.78876638, 0],
                        [-38.59084293, -3.78691572, 0],
                        [-38.59334736, -3.7841046, 0],
                        [-38.59353055, -3.78254319, 0],
                        [-38.59409409, -3.78022096, 0],
                        [-38.59522713, -3.77811446, 0],
                      ],
                    ],
                  ],
                },
                geometry_name: "The_geom",
                properties: {
                  id: 1,
                  fid: 1,
                  Nome: "211396 - SER V - BOM SUCESSO II 2",
                  Descrição: "DOMICILIAR ECOFOR",
                  Turno: "DIURNO",
                  Ano: "2024",
                  Fonte:
                    "Secretaria Municipal de Conservação e Serviços Públicos - SCSP",
                  "SRC  da camada": "EPSG:4326 - WGS 84",
                  Codificação: "UTF-8",
                },
              },
            },
          },
        },
      },
    },
  },
  "/clima": {
    get: {
      summary: "Retorna dados climáticos atuais (via Open-Meteo)",
      responses: {
        200: {
          description: "Dados climáticos atuais em Fortaleza",
          content: {
            "application/json": {
              example: {
                status: "ok",
                clima: {
                  latitude: -3.75,
                  longitude: -38.5,
                  timezone: "GMT",
                  elevation: 21,
                  temperatura: 32.2,
                  temperatura_unidade: "°C",
                  tempo: "2025-09-20T14:30",
                  vento: {
                    velocidade: 22.2,
                    direcao: 107,
                    unidade: "km/h",
                  },
                  codigo_clima: 2,
                  is_dia: true,
                },
              },
            },
          },
        },
      },
    },
  },
};

swaggerSpec.components = {
  
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
}

export default swaggerSpec;
