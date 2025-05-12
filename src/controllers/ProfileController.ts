import { Request, Response } from "express";
import { ProfileService } from "../services/ProfileService";
import { isValidPhoneNumberFormat } from "../utils/isValidPhoneNumberFormat";

class ProfileController {
  constructor(private profileService: ProfileService) {
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
  }

  async getProfile(req: Request, res: Response) {
    const { uid, email } = req.user;
    try {
      const data = await this.profileService.getUserProfile(uid);

      res.status(200).json({
        uid,
        email,
        phone_number: data.phone_number || null,
        name: data.name || null,
        picture: data.picture || null,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar perfil do usuário" });
    }
  }

  async updateProfile(req: Request, res: Response) {
    const { name, phone_number, picture } = req.body;

    if (!isValidPhoneNumberFormat(phone_number)) {
      res.status(400).json({
        error: "Número de telefone inválido. Use o padrão 11912345678.",
      });
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

    await this.profileService.updateUserProfile({
      uid: req.user.uid,
      email: req.user.email,
      name,
      phone_number,
      picture,
    });

    res.sendStatus(200);
  }

  async deleteAccount(req: Request, res: Response) {
    const { uid } = req.user;

    try {
      await this.profileService.deleteUserAccount(uid);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar conta do usuário" });
    }
  }
}

export default ProfileController;
