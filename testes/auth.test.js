import request from "supertest";
import app from "../src/app.js";
const { User } = require("../parseClient.js");

jest.mock("../parseClient.js", () => {
  // Classe mock para instâncias (register)
  class MockUser {
    constructor() {
      this.fields = {};
      this.id = "456";
    }
    set(key, value) {
      this.fields[key] = value;
    }
    get(key) {
      return this.fields[key];
    }
    signUp() {
      if (this.fields.username && this.fields.password && this.fields.email) {
        return Promise.resolve(this);
      }
      return Promise.reject(new Error("Dados incompletos"));
    }
  }

  return {
    // Permitir instanciamento
    User: Object.assign(MockUser, {
      // Métodos estáticos
      logIn: jest.fn((username, password) => {
        if (username === "usuario_exemplo" && password === "senha123") {
          return Promise.resolve({
            id: "123",
            get: (key) => {
              if (key === "username") return "usuario_exemplo";
              if (key === "email") return "usuario@example.com";
              if (key === "sessionToken") return "token";
            },
            getSessionToken: () => "token",
          });
        }
        return Promise.reject(new Error("Credenciais inválidas"));
      }),
      logOut: jest.fn(() => Promise.resolve()),
    }),
  };
});

describe("Auth Controller", () => {
  describe("POST /login", () => {
    it("deve logar com credenciais corretas", async () => {
      const res = await request(app)
        .post("/login")
        .send({ username: "usuario_exemplo", password: "senha123" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Login realizado com sucesso");
      expect(res.body.user).toHaveProperty("username", "usuario_exemplo");
      expect(res.body.user).toHaveProperty("email", "usuario@example.com");
      expect(res.body).toHaveProperty("sessionToken");
    });

    it("deve retornar 400 se username ou password estiver faltando", async () => {
      const res = await request(app)
        .post("/login")
        .send({ username: "usuario" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Usuário e senha são obrigatórios"
      );
    });

    it("deve retornar 401 se credenciais forem inválidas", async () => {
      const res = await request(app)
        .post("/login")
        .send({ username: "usuario", password: "errada" });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error", "Credenciais inválidas");
    });

    it("deve retornar 401 se Parse.User.logIn lançar erro genérico", async () => {
      // Mocka logIn para lançar erro genérico
      User.logIn.mockImplementationOnce(() =>
        Promise.reject(new Error("Login falhou"))
      );
      const res = await request(app)
        .post("/login")
        .send({ username: "usuario", password: "senha" });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error", "Login falhou");
    });
  });

  describe("POST /logout", () => {
    it("deve fazer logout com sucesso", async () => {
      const res = await request(app)
        .post("/logout")
        .set("Authorization", "Bearer fakeToken")
        .send({});
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Logout realizado com sucesso"
      );
    });

    it("deve retornar 400 se não enviar token de sessão", async () => {
      const res = await request(app).post("/logout").send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Token de sessão é obrigatório para logout"
      );
    });

    it("deve retornar 500 se logOut lançar erro", async () => {
      User.logOut.mockImplementationOnce(() =>
        Promise.reject(new Error("Logout falhou"))
      );
      const res = await request(app)
        .post("/logout")
        .set("Authorization", "Bearer fakeToken")
        .send({});
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty("error", "Logout falhou");
    });
  });

  describe("POST /register", () => {
    it("deve registrar usuário com sucesso", async () => {
      const res = await request(app).post("/register").send({
        username: "novo",
        password: "senha123",
        email: "novo@teste.com",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Usuário registrado com sucesso"
      );
      expect(res.body.user).toHaveProperty("username", "novo");
      expect(res.body.user).toHaveProperty("email", "novo@teste.com");
    });

    it("deve retornar 400 se algum campo estiver faltando", async () => {
      const res = await request(app).post("/register").send({
        username: "novo",
        password: "senha123",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "error",
        "Usuário, senha e email são obrigatórios"
      );
    });

    it("deve retornar 400 se signUp lançar erro genérico", async () => {
      // Mocka signUp para lançar erro genérico
      User.prototype.signUp = jest.fn(() =>
        Promise.reject(new Error("Registro falhou"))
      );
      const res = await request(app).post("/register").send({
        username: "novo",
        password: "senha123",
        email: "email@teste.com",
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error", "Registro falhou");
    });
  });
});
