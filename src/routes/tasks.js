const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const firestore = require("../services/firestore");

router.use(auth);

router.get("/", async (req, res) => {
  const tasks = await firestore.getUserTasks(req.user.uid);
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const task = { ...req.body, uid: req.user.uid, createdAt: new Date() };
  const result = await firestore.createTask(task);
  res.status(201).json(result);
});

router.put("/:id", async (req, res) => {
  await firestore.updateTask(req.params.id, req.body);
  res.sendStatus(200);
});

router.delete("/:id", async (req, res) => {
  await firestore.deleteTask(req.params.id);
  res.sendStatus(204);
});

module.exports = router;
