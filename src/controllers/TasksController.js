const TasksService = require("../services/TasksService");

class TasksController {
  static async getTasks(req, res) {
    try {
      const tasks = await TasksService.getUserTasks(
        req.user.uid,
        req.user.email
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createTask(req, res) {
    const {
      title,
      description = "",
      done = false,
      subtasks = [],
      tags = [],
    } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Título da tarefa é obrigatório" });
    }

    if (
      !Array.isArray(tags) ||
      tags.length > 5 ||
      !tags.every((t) => typeof t === "string")
    ) {
      return res
        .status(400)
        .json({ error: "Tags inválidas. Use no máximo 5 strings." });
    }

    if (
      !Array.isArray(subtasks) ||
      !subtasks.every(
        (st) => typeof st.title === "string" && typeof st.done === "boolean"
      )
    ) {
      return res.status(400).json({ error: "Formato de subtasks inválido" });
    }

    try {
      const task = {
        title,
        description,
        done,
        subtasks,
        uid: req.user.uid,
        tags,
        createdAt: new Date(),
      };
      const result = await TasksService.createTask(task);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateTask(req, res) {
    const { title, description, done, subtasks, tags } = req.body;

    if (
      tags &&
      (!Array.isArray(tags) ||
        tags.length > 5 ||
        !tags.every((t) => typeof t === "string"))
    ) {
      return res
        .status(400)
        .json({ error: "Tags inválidas. Use no máximo 5 strings." });
    }

    if (
      subtasks &&
      (!Array.isArray(subtasks) ||
        !subtasks.every(
          (st) => typeof st.title === "string" && typeof st.done === "boolean"
        ))
    ) {
      return res.status(400).json({ error: "Formato de subtasks inválido" });
    }

    const dataToUpdate = { uid: req.user.uid };
    if (title) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (done !== undefined) dataToUpdate.done = done;
    if (subtasks !== undefined) dataToUpdate.subtasks = subtasks;
    if (tags !== undefined) dataToUpdate.tags = tags;

    try {
      await TasksService.updateTask(req.params.id, dataToUpdate);
      res.sendStatus(200);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      await TasksService.deleteTask(req.params.id, req.user.uid);
      res.sendStatus(204);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async shareTask(req, res) {
    const { sharedWith } = req.body;

    if (
      !Array.isArray(sharedWith) ||
      !sharedWith.every((email) => typeof email === "string")
    ) {
      return res.status(400).json({ error: "Lista de e-mails inválida" });
    }

    try {
      const result = await TasksService.shareTask(req.params.id, sharedWith);
      if (result.invalidEmails.length > 0) {
        return res.status(400).json({
          error: "Os seguintes e-mails não existem na base de dados",
          invalidEmails: result.invalidEmails,
        });
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = TasksController;
