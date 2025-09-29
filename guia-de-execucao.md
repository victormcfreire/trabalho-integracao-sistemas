# Guia de Execução da API

## Requisitos

- **Node.js 20 ou superior** instalado na máquina.
- Acesso à internet para baixar dependências do `package.json`.

---

## Instalação

1. Clone o repositório da API (ou faça download do projeto).
2. No terminal, entre na pasta do projeto:
   ```bash 
   cd nome-do-projeto
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

---

## Rodando a API

1. Para iniciar a API, execute:

   ```bash
   npm run start
   ```
2. A API será iniciada no endereço:

   [http://localhost:3000](http://localhost:3000)
  
3. Para acessar a documentação da API (Swagger), abra no navegador:

   [http://localhost:3000/docs](http://localhost:3000/docs)


---

## Usando a Autenticação no Swagger

1. Para acessar endpoints protegidos via `/docs`, você precisa de um **sessionToken** válido:

   * Faça login utilizando o endpoint de login da API.
   * Pegue o valor retornado no campo `sessionToken`.
2. Clique no botão **Authorize** no Swagger.
3. Insira o token no campo

4. Após isso, você poderá testar os endpoints protegidos diretamente no Swagger.

---

## Executando os Testes

1. Para rodar todos os testes automatizados, execute:

   ```bash
   npm test
   ```
2. O Jest irá executar todos os testes definidos no projeto e mostrar o resultado no terminal.

---

## Observações

* Certifique-se de que a porta 3000 não esteja sendo usada por outro serviço.
* Para alterar a porta, modifique a configuração no .env (propriedade `PORT`).
* Para qualquer dúvida sobre endpoints ou uso da API, consulte a documentação Swagger em `/docs`.

