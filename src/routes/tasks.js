const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const TasksController = require("../controllers/TasksController");

router.use(auth);

router.get("/", TasksController.getTasks);

router.post("/", TasksController.createTask);

router.put("/:id", TasksController.updateTask);

router.delete("/:id", TasksController.deleteTask);

router.put("/:id/share", TasksController.shareTask);

module.exports = router;
