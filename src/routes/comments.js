const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("firebase-admin");

router.use(auth);

router.post("/", async (req, res) => {
  const { taskId, content } = req.body;

  if (!taskId || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "Campos inválidos" });
  }

  await admin.firestore().collection("comments").add({
    taskId,
    content: content.trim(),
    author: req.user.email,
    createdAt: new Date(),
  });

  res.sendStatus(201);
});

router.get("/:taskId", async (req, res) => {
  const { taskId } = req.params;

  const snapshot = await admin
    .firestore()
    .collection("comments")
    .where("taskId", "==", taskId)
    .orderBy("createdAt", "asc")
    .get();

  if (snapshot.empty) {
    return res.status(404).json({ message: "Nenhum comentário encontrado" });
  }
  const comments = snapshot.docs.map((doc) => doc.data());
  res.json(comments);
});

module.exports = router;
