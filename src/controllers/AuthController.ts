import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { isValidPhoneNumberFormat } from "../utils/isValidPhoneNumberFormat";

class AuthController {
  constructor(private authService: AuthService) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  async register(req: Request, res: Response) {
    const { email, password, name, phone_number } = req.body;

    if (!email || !password || !name || !phone_number) {
      res.status(400).json({ error: "Campos obrigatórios ausentes" });
      return;
    }

    if (!isValidPhoneNumberFormat(phone_number)) {
      res.status(400).json({
        error: "Número de telefone inválido. Use o padrão 11912345678.",
      });
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
      res
        .status(401)
        .json({ error: "Email ou senha inválidos", falha: err as Error });
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
