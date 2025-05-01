import { Router } from "express";
import TasksController from "../controllers/TasksController";
import authMiddleware from "../middleware/auth";
import TasksServiceImpl from "../services/TasksService";

const tasksController = new TasksController(new TasksServiceImpl());

const router = Router();

router.use(authMiddleware);

router.get("/", tasksController.getTasks);

router.post("/", tasksController.createTask);

router.put("/:id", tasksController.updateTask);

router.delete("/:id", tasksController.deleteTask);

router.put("/:id/share", tasksController.shareTask);

export default router;
