import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  async register(req: Request, res: Response) {
    const { email, password, name, phone_number } = req.body;

    if (!email || !password || !name || !phone_number) {
      res.status(400).json({ error: "Campos obrigatórios ausentes" });
      return;
    }

    try {
      const result = await this.authService.register({
        email,
        password,
        name,
        phone_number,
      });
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email e senha obrigatórios" });
      return;
    }

    try {
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: "Email ou senha inválidos" });
    }
  }

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: "refreshToken obrigatório" });
      return;
    }

    try {
      const result = await this.authService.refresh(refreshToken);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Erro ao renovar o token" });
    }
  }
}

export default AuthController;
