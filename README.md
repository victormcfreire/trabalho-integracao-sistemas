

# Sistema de Informação para Descarte Correto de Lixo

## Objetivo do Trabalho
Este projeto visa desenvolver uma API unificada para informar e conscientizar a população sobre os locais de descarte correto do lixo, combatendo problemas urbanos como proliferação de insetos, doenças e alagamentos causados pelo descarte inadequado. A solução centraliza informações sobre pontos de coleta, turnos de coleta, condições climáticas e qualidade do ar, permitindo integração entre múltiplos sistemas e fornecendo autenticação para usos controlados.

## Descrição Funcional da Solução
A aplicação consiste em uma API agregadora que disponibiliza:
- Mapa interativo com pontos de coleta de lixo
- Informações em tempo real sobre clima e qualidade do ar
- Filtros por turnos de coleta e tipos de pontos de coleta
- Sistema de autenticação para controle de acesso
- Interface multiplataforma (web e mobile) desenvolvida em Flutter

## Arquitetura da API

### Diagrama de Arquitetura

```
Cliente (Web/Mobile)
↓
API Central (Express.js)
↓
┌────────────────────────────────────────┐
│                                        │
Back4App                           APIs Externas
(Pontos de Coleta,              (Clima, Qualidade do Ar)
Autenticação, Turnos)

```

## Fluxo de Comunicação
- Cliente envia requisição HTTP para a API Central
- API Central atua como Fachada de Agregação, processa a requisição e direciona para o serviço apropriado
- Para dados de mapas/autenticação: comunicação com Back4App
- Para dados ambientais: comunicação com APIs Externas (Open-Meteo, WAQI)
- API Central formata a resposta e retorna ao cliente em JSON/GeoJSON padronizado


## Execução via Postman/Insomnia

### Pré-requisitos
- Postman ou Insomnia instalado
- API ativa
- Token de autenticação (obtido via endpoint /login)

### Autenticação
- Realizar login via POST /login para obter o sessionToken
- Incluir o token no header Authorization das requisições protegidas
- ATENÇÃO: Na hora de selecionar o arquivo para abri-lo na plataforma, é necessário trocar "arquivo personalizado" por "todos os arquivos" para que o mesmo possa ser visualizado e selecionado.

## Documentação das Rotas da API

### Autenticação
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST   | /register | Registra novo usuário | Não |
| POST   | /login    | Autentica usuário e retorna token | Não |
| POST   | /logout   | Finaliza sessão do usuário | Sim |

### Pontos de Coleta
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET    | /pontos-coleta | Retorna FeatureCollection com pontos de coleta | Sim |

#### Exemplo de Resposta:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-38.1234, -3.5678]
      },
      "properties": {
        "nome": "Ponto de Coleta Centro",
        "endereco": "Rua Exemplo, 123"
      }
    }
  ]
}
````

### Turnos de Coleta

| Método | Endpoint                   | Descrição                                          | Autenticação |
| ------ | -------------------------- | -------------------------------------------------- | ------------ |
| GET    | /turnos-coleta             | Retorna FeatureCollection com polígonos dos turnos | Sim          |
| GET    | /turnos-coleta?turno=manhã | Filtra turnos por parâmetro                        | Sim          |

### Dados Ambientais

| Método | Endpoint      | Descrição                               | Autenticação |
| ------ | ------------- | --------------------------------------- | ------------ |
| GET    | /clima        | Retorna informações climáticas atuais   | Não          |
| GET    | /qualidade-ar | Retorna índice de qualidade do ar (AQI) | Não          |

#### Exemplo Resposta /clima:

```json
{
  "temperatura": 28,
  "condicao": "ensolarado",
  "umidade": 65,
  "velocidadeVento": 15
}
```

#### Exemplo Resposta /qualidade-ar:

```json
{
  "indiceQualidadeAr": 50,
  "nivel": "Bom",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "estacao": "São Paulo, Centro",
  "poluenteDominante": "pm25",
  "iaqi": {
    "pm25": { "v": 50 },
    "o3": { "v": 34 },
    "no2": { "v": 15 }
  }
}
```

## Códigos de Status HTTP

| Código | Descrição                |
| ------ | ------------------------ |
| 200    | Sucesso                  |
| 400    | Requisição inválida      |
| 401    | Não autorizado           |
| 404    | Recurso não encontrado   |
| 500    | Erro interno do servidor |

## Tratamento de Erros

Todas as respostas de erro seguem o formato:

```json
{
  "error": "Mensagem descritiva do erro"
}
```

# Relação com ODS 11 - Cidades e Comunidades Sustentáveis

## Alinhamento com a Agenda 2030 da ONU

O projeto **EcoMapa Fortaleza** está diretamente alinhado com o **Objetivo de Desenvolvimento Sustentável 11** da ONU, que visa "tornar as cidades e os assentamentos humanos inclusivos, seguros, resilientes e sustentáveis".

## Metas Específicas Atendidas

### Meta 11.6
**"Até 2030, reduzir o impacto ambiental negativo per capita das cidades, inclusive prestando especial atenção à qualidade do ar, gestão de resíduos municipais e outros"**

- **Gestão de Resíduos**: Sistema centralizado de informações sobre pontos de coleta
- **Qualidade do Ar**: Integração com dados de poluição atmosférica em tempo real
- **Conscientização**: Educação ambiental através de tecnologia acessível

### Meta 11.3
**"Até 2030, aumentar a urbanização inclusiva e sustentável"**

- **Acessibilidade**: Interface multiplataforma para todos os cidadãos
- **Participação Social**: Ferramenta que engaja a população na gestão urbana
- **Transparência**: Dados abertos sobre infraestrutura de coleta

## Impacto na Sustentabilidade Urbana

### Redução de Impactos Ambientais
- Diminuição do descarte inadequado de resíduos
- Prevenção de alagamentos por obstrução de bueiros
- Redução da proliferação de doenças e insetos

### Cidades Mais Inteligentes
- Digitalização dos serviços de limpeza urbana
- Otimização de rotas de coleta através de dados georreferenciados
- Integração de informações ambientais em uma única plataforma

### Inclusão Social
- Acesso gratuito à informação para todos os cidadãos
- Ferramenta disponível em múltiplas plataformas
- Linguagem acessível e interface intuitiva

## Contribuição para Fortaleza Sustentável

O EcoMapa Fortaleza representa um passo concreto em direção à:
- **Gestão pública mais eficiente**
- **Participação cidadã ativa**
- **Monitoramento ambiental contínuo**
- **Transição para economia circular**

*"Tecnologia a serviço de cidades mais limpas, saudáveis e sustentáveis"*

