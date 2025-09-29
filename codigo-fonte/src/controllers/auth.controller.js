// src/controllers/auth.controller.js
import Parse from "../../parseClient.js";

/**
 * Controller POST /login
 * body: { username, password }
 */
export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Usuário e senha são obrigatórios" });
  }

  try {
    const user = await Parse.User.logIn(username, password);
    Parse.User.currentAsync = async () => user;

    return res.status(200).json({
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        username: user.get("username"),
        email: user.get("email"),
      },
      sessionToken: user.getSessionToken(),
    });
  } catch (err) {
    return res.status(401).json({ error: err.message || "Login falhou" });
  }
}

export async function logout(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ error: "Token de sessão é obrigatório para logout" });
  }
  try {
    // Invalida o token de sessão do usuário
    const sessionToken = authHeader.split(" ")[1];
    console.log(sessionToken);
    await Parse.User.logOut({ sessionToken });
    return res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Logout falhou" });
  }
}

export async function register(req, res) {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: "Usuário, senha e email são obrigatórios" });
  }

  const user = new Parse.User();
  user.set("username", username);
  user.set("password", password);
  user.set("email", email);

  try {
    await user.signUp();
    return res.status(201).json({
      message: "Usuário registrado com sucesso",
      user: {
        id: user.id,
        username: user.get("username"),
        email: user.get("email"),
      },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || "Registro falhou" });
  }
}
