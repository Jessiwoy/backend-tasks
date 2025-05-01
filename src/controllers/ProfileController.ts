import { Request, Response } from "express";
import { ProfileService } from "../services/ProfileService";

class ProfileController {
  private profileService: ProfileService;

  constructor(profileService: ProfileService) {
    this.profileService = profileService;
  }

  async getProfile(req: Request, res: Response) {
    const { uid, email } = req.user;
    try {
      const data = await this.profileService.getUserProfile(uid);

      res.status(200).json({
        uid,
        email,
        name: data.name || null,
        picture: data.picture || null,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Erro ao buscar perfil do usuário" });
    }
  }

  async updateAvatar(req: Request, res: Response) {
    const { picture } = req.body;

    if (!picture || !/^avatar_[1-5]$/.test(picture)) {
      res.status(400).json({ error: "ID de avatar inválido" });
      return;
    }

    await this.profileService.updateUserAvatar(req.user.uid, picture);
    res.sendStatus(200);
  }

  async updateName(req: Request, res: Response) {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ error: "Nome inválido" });
      return;
    }

    await this.profileService.updateUserName(req.user.uid, name);
    res.sendStatus(200);
  }

  async createOrUpdateProfile(req: Request, res: Response) {
    const { name, phone_number, picture } = req.body;

    const phoneRegex = /^[0-9]+$/;
    if (!phone_number || !phoneRegex.test(phone_number)) {
      res.status(400).json({ error: "Telefone somente com números" });
      return;
    }
    if (
      !phone_number ||
      typeof phone_number !== "string" ||
      phone_number.trim() === ""
    ) {
      res.status(400).json({ error: "Telefone inválido" });
      return;
    }

    if (!picture || !/^avatar_[1-5]$/.test(picture)) {
      res.status(400).json({ error: "ID de avatar inválido" });
      return;
    }

    if (req.user.email === undefined) {
      res.status(400).json({ error: "Email inválido" });
      return;
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      res.status(400).json({ error: "Nome inválido" });
      return;
    }

    await this.profileService.createOrUpdateUserProfile({
      uid: req.user.uid,
      email: req.user.email,
      name,
      phone_number,
      picture,
    });

    res.sendStatus(200);
  }
}

export default ProfileController;
