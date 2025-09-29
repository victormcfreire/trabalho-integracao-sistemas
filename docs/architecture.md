# Arquitetura da API

## Visão Geral
A arquitetura da API é composta por três camadas principais:

- **Cliente (Web/Mobile)**: Faz requisições HTTP para a API central.
- **API Central (Express.js)**: Atua como fachada de agregação, processando as requisições e direcionando para os serviços apropriados.
- **Serviços de Backend**:
  - **Back4App**: Responsável por pontos de coleta, autenticação e turnos.
  - **APIs Externas**: Fornecem dados ambientais, como clima (Open-Meteo) e qualidade do ar (WAQI).

---

## Fluxo de Comunicação

1. O **cliente** envia uma requisição HTTP para a **API Central**.
2. A **API Central** recebe a requisição e atua como **fachada de agregação**, decidindo qual serviço atenderá.
3. Dependendo da necessidade:
   - Para **dados de mapas ou autenticação**, a comunicação é feita com o **Back4App**.
   - Para **dados ambientais**, a comunicação é feita com **APIs externas** (Open-Meteo, WAQI).
4. A **API Central** processa os dados recebidos e formata a resposta no padrão **JSON/GeoJSON**.
5. A resposta final é enviada de volta ao **cliente**.

---

## Diagrama de Fluxo

```
    A[Cliente (Web/Mobile)] --> B[API Central (Express.js)]
    B --> C[Back4App (Pontos de Coleta, Autenticação, Turnos)]
    B --> D[APIs Externas (Clima, Qualidade do Ar)]
    C --> B
    D --> B
    B --> A
