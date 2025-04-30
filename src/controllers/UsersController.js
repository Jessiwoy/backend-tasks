const UsersService = require("../services/UsersService");
const usersService = new UsersService();

async function search(req, res) {
  const { query } = req.query;

  if (!query || typeof query !== "string" || query.trim() === "") {
    return res.status(400).json({ error: "Query inválida" });
  }

  try {
    const users = await usersService.search(query);

    if (users.length === 0) {
      return res.status(404).json({ message: "Nenhum usuário encontrado" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      status_message: "Internal Server Error",
      message: error.message,
      error,
    });
  }
}

module.exports = {
  search,
};
