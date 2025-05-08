import { Router } from "express";
import TasksController from "../controllers/TasksController";
import authMiddleware from "../middleware/auth";
import container from "../containers/container";

const tasksController = container.resolve<TasksController>("TasksController");

const router = Router();

router.use(authMiddleware);

router.get("/", tasksController.getTasks);

router.post("/", tasksController.createTask);

router.put("/:id", tasksController.updateTask);

router.delete("/:id", tasksController.deleteTask);

router.put("/:id/share", tasksController.shareTask);

export default router;
