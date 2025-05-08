import { Request, Response } from "express";
import { UsersService } from "../services/UsersService";

class UsersController {
  constructor(private usersService: UsersService) {
    this.search = this.search.bind(this);
  }

  async search(req: Request, res: Response): Promise<void> {
    const { query } = req.query;

    if (!query || typeof query !== "string" || query.trim() === "") {
      res.status(400).json({ error: "Query inválida" });
      return;
    }

    try {
      const users = await this.usersService.search(query);

      if (users.length === 0) {
        res.status(404).json({ message: "Nenhum usuário encontrado" });
        return;
      }

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({
        status_message: "Internal Server Error",
        message: (error as Error).message,
        error,
      });
    }
  }
}

export default UsersController;
