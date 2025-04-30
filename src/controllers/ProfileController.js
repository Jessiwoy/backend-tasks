const ProfileService = require("../services/ProfileService");

class ProfileController {
  static async getProfile(req, res) {
    const { uid, email } = req.user;
    const data = await ProfileService.getUserProfile(uid);

    res.json({
      uid,
      email,
      name: data.name || null,
      picture: data.picture || null,
    });
  }

  static async updateAvatar(req, res) {
    const { picture } = req.body;

    if (!picture || !/^avatar_[1-5]$/.test(picture)) {
      return res.status(400).json({ error: "ID de avatar inválido" });
    }

    await ProfileService.updateUserAvatar(req.user.uid, picture);
    res.sendStatus(200);
  }

  static async updateName(req, res) {
    const { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Nome inválido" });
    }

    await ProfileService.updateUserName(req.user.uid, name);
    res.sendStatus(200);
  }

  static async createOrUpdateProfile(req, res) {
    const { name, phone_number, picture } = req.body;

    const phoneRegex = /^[0-9]+$/;
    if (!phone_number || !phoneRegex.test(phone_number)) {
      return res.status(400).json({ error: "Telefone somente com números" });
    }
    if (
      !phone_number ||
      typeof phone_number !== "string" ||
      phone_number.trim() === ""
    ) {
      return res.status(400).json({ error: "Telefone inválido" });
    }

    if (!picture || !/^avatar_[1-5]$/.test(picture)) {
      return res.status(400).json({ error: "ID de avatar inválido" });
    }

    await ProfileService.createOrUpdateUserProfile(
      req.user.uid,
      req.user.email,
      name,
      phone_number,
      picture
    );

    res.sendStatus(200);
  }
}

module.exports = ProfileController;
