const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const firestore = require("../services/firestore");

router.use(auth);

router.get("/", async (req, res) => {
  const tasks = await firestore.getUserTasks(req.user.uid, req.user.email);
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const { title, description = "", done = false, subtasks = [] } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Título da tarefa é obrigatório" });
  }

  if (
    !Array.isArray(subtasks) ||
    !subtasks.every(
      (st) => typeof st.title === "string" && typeof st.done === "boolean"
    )
  ) {
    return res.status(400).json({ error: "Formato de subtasks inválido" });
  }

  const task = {
    title,
    description,
    done,
    subtasks,
    uid: req.user.uid,
    createdAt: new Date(),
  };

  const result = await firestore.createTask(task);
  res.status(201).json(result);
});

router.put("/:id", async (req, res) => {
  const { title, description, done, subtasks } = req.body;

  if (
    subtasks &&
    (!Array.isArray(subtasks) ||
      !subtasks.every(
        (st) => typeof st.title === "string" && typeof st.done === "boolean"
      ))
  ) {
    return res.status(400).json({ error: "Formato de subtasks inválido" });
  }

  const dataToUpdate = {};
  if (title) dataToUpdate.title = title;
  if (description !== undefined) dataToUpdate.description = description;
  if (done !== undefined) dataToUpdate.done = done;
  if (subtasks !== undefined) dataToUpdate.subtasks = subtasks;

  try {
    await firestore.updateTask(req.params.id, dataToUpdate);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  await firestore.deleteTask(req.params.id);
  res.sendStatus(204);
});

router.put("/:id/share", async (req, res) => {
  const { sharedWith } = req.body;

  if (
    !Array.isArray(sharedWith) ||
    !sharedWith.every((email) => typeof email === "string")
  ) {
    return res.status(400).json({ error: "Lista de e-mails inválida" });
  }

  try {
    await firestore.shareTask(req.params.id, sharedWith);
    res.sendStatus(200);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

module.exports = router;
