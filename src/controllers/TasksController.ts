import { Request, Response } from "express";
import { TasksService } from "../services/TasksService";
import {
  BaseTask,
  Subtask,
  Taggable,
  UserIndentifiable,
} from "../model/taskModel";

class TasksController {
  tasksService: TasksService;

  constructor(tasksService: TasksService) {
    this.tasksService = tasksService;
  }

  async getTasks(req: Request, res: Response) {
    try {
      const tasks = await this.tasksService.getUserTasks(
        req.user.uid,
        req.user.email
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async createTask(
    req: Request<unknown, unknown, Pick<BaseTask, "title" | "description">>,
    res: Response
  ): Promise<void> {
    const { title, description = "" } = req.body;

    if (!title || typeof title !== "string") {
      res.status(400).json({ error: "Título da tarefa é obrigatório" });
      return;
    }

    try {
      const task: BaseTask & UserIndentifiable = {
        title,
        description,
        uid: req.user.uid,
        createdAt: new Date(),
        done: false,
      };
      const result = await this.tasksService.createTask(task);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateTask(
    req: Request<
      { id: string },
      unknown,
      Partial<BaseTask & Taggable & { subtasks?: Subtask[] }>
    >,
    res: Response
  ): Promise<void> {
    const { title, description, done, subtasks, tags } = req.body;

    if (
      tags &&
      (!Array.isArray(tags) ||
        tags.length > 5 ||
        !tags.every((t) => typeof t === "string"))
    ) {
      res
        .status(400)
        .json({ error: "Tags inválidas. Use no máximo 5 strings." });
      return;
    }

    if (
      subtasks &&
      (!Array.isArray(subtasks) ||
        !subtasks.every(
          (st) => typeof st.title === "string" && typeof st.done === "boolean"
        ))
    ) {
      res.status(400).json({ error: "Formato de subtasks inválido" });
      return;
    }

    const dataToUpdate: UserIndentifiable &
      Partial<BaseTask & Taggable & { subtasks?: Subtask[] }> = {
      uid: req.user.uid,
    };
    if (title) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (done !== undefined) dataToUpdate.done = done;
    if (subtasks !== undefined) dataToUpdate.subtasks = subtasks;
    if (tags !== undefined) dataToUpdate.tags = tags;

    try {
      await this.tasksService.updateTask(req.params.id, dataToUpdate);
      res.sendStatus(200);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      await this.tasksService.deleteTask(req.params.id, req.user.uid);
      res.sendStatus(204);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  }

  async shareTask(req: Request, res: Response): Promise<void> {
    const { sharedWith } = req.body;

    if (
      !Array.isArray(sharedWith) ||
      !sharedWith.every((email) => typeof email === "string")
    ) {
      res.status(400).json({ error: "Lista de e-mails inválida" });
      return;
    }

    try {
      const result = await this.tasksService.shareTask(
        req.params.id,
        sharedWith
      );
      if (result.invalidEmails.length > 0) {
        res.status(400).json({
          error: "Os seguintes e-mails não existem na base de dados",
          invalidEmails: result.invalidEmails,
        });
        return;
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(403).json({ error: (error as Error).message });
    }
  }
}

export default TasksController;
