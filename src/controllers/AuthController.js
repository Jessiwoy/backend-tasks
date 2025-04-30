const AuthService = require("../services/AuthService");

class AuthController {
  static async register(req, res) {
    const { email, password, name, phone_number } = req.body;

    if (!email || !password || !name || !phone_number) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }

    try {
      const result = await AuthService.register(
        email,
        password,
        name,
        phone_number
      );
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha obrigatórios" });
    }

    try {
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: "Email ou senha inválidos" });
    }
  }

  static async refresh(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "refreshToken obrigatório" });
    }

    try {
      const result = await AuthService.refresh(refreshToken);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Erro ao renovar o token" });
    }
  }
}

module.exports = AuthController;
