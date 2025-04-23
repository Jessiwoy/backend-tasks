const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const firestore = require("../services/firestore");
const admin = require("firebase-admin");

router.use(auth);

router.get("/", async (req, res) => {
  const tasks = await firestore.getUserTasks(req.user.uid, req.user.email);
  res.json(tasks);
});

router.post("/", async (req, res) => {
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

  const task = {
    title,
    description,
    done,
    subtasks,
    uid: req.user.uid,
    tags,
    createdAt: new Date(),
  };

  const result = await firestore.createTask(task);
  res.status(201).json(result);
});

router.put("/:id", async (req, res) => {
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
    await firestore.updateTask(req.params.id, dataToUpdate);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  await firestore.deleteTask(req.params.id, req.user.uid);
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

  const snapshot = await admin
    .firestore()
    .collection("users")
    .where("email", "in", sharedWith)
    .get();

  const validEmails = snapshot.docs.map((doc) => doc.data().email);

  const invalidEmails = sharedWith.filter(
    (email) => !validEmails.includes(email)
  );

  if (invalidEmails.length > 0) {
    return res.status(400).json({
      error: "Os seguintes e-mails não existem na base de dados",
      invalidEmails,
    });
  }

  try {
    await firestore.shareTask(req.params.id, sharedWith);
    res.sendStatus(200);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

module.exports = router;
