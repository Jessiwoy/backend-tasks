import { Request, Response } from "express";
import TasksController from "../../src/controllers/TasksController";
import { TasksService } from "../../src/services/TasksService";
import { DecodedIdToken } from "firebase-admin/auth";
import { ParsedQs } from "qs";
import { BaseTask, Subtask, Taggable } from "../../src/model/taskModel";

describe("TasksController", () => {
  let tasksService: TasksService;
  let tasksController: TasksController;
  let req: Partial<Request & { user: Partial<DecodedIdToken> }>;
  let res: Partial<Response>;

  beforeEach(() => {
    tasksService = {
      getUserTasks: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    } as unknown as TasksService;

    tasksController = new TasksController(tasksService);
    req = {
      user: {
        email: "test@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "user123",
      } as DecodedIdToken,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  describe("getTasks", () => {
    it("should return 400 if user email is undefined", async () => {
      req.user = {
        email: undefined,
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "123",
      } as DecodedIdToken;

      await tasksController.getTasks(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Email do usuário não encontrado",
      });
    });

    it("should return tasks if user email is valid", async () => {
      const mockTasks = [{ id: 1, title: "Task 1" }];
      (tasksService.getUserTasks as jest.Mock).mockResolvedValue(mockTasks);

      await tasksController.getTasks(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it("should return 500 if an error occurs", async () => {
      const mockError = new Error("Something went wrong");
      (tasksService.getUserTasks as jest.Mock).mockRejectedValue(mockError);

      await tasksController.getTasks(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
  });

  describe("createTask", () => {
    it("should return 400 if title is missing", async () => {
      req.body = { description: "Test description", deadline: "01/01/2024" };

      await tasksController.createTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Título da tarefa é obrigatório",
      });
    });

    it("should return 400 if deadline format is invalid", async () => {
      req.body = {
        title: "Test Task",
        description: "Test description",
        deadline: "invalid-date",
      };

      await tasksController.createTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Formato de deadline inválido. Use dd/mm/yyyy.",
      });
    });

    it("should create a task and return 201 if data is valid", async () => {
      const mockTask = {
        id: 1,
        title: "Test Task",
        description: "Test description",
        deadline: "01/01/2024",
      };
      (tasksService.createTask as jest.Mock).mockResolvedValue(mockTask);

      req.body = {
        title: "Test Task",
        description: "Test description",
        deadline: "01/01/2024",
      };

      await tasksController.createTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });

    it("should return 500 if an error occurs", async () => {
      const mockError = new Error("Something went wrong");
      (tasksService.createTask as jest.Mock).mockRejectedValue(mockError);

      req.body = {
        title: "Test Task",
        description: "Test description",
        deadline: "01/01/2024",
      };

      await tasksController.createTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
  });

  describe("updateTask", () => {
    it("should return 400 if tags are invalid", async () => {
      req.body = { tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"] };

      await tasksController.updateTask(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Tags inválidas. Use no máximo 5 strings.",
      });
    });

    it("should return 400 if subtasks are invalid", async () => {
      req.body = { subtasks: [{ title: "Subtask 1", done: "invalid" }] };

      await tasksController.updateTask(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Formato de subtasks inválido",
      });
    });

    it("should return 400 if priority is invalid", async () => {
      req.body = { priority: 5 };

      await tasksController.updateTask(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Prioridade deve ser um número entre 1 e 3",
      });
    });

    it("should return 400 if deadline format is invalid", async () => {
      req.body = { deadline: "invalid-date" };

      await tasksController.updateTask(req as any, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Formato de deadline inválido. Use dd/mm/yyyy.",
      });
    });

    it("should update the task and return 200 if data is valid", async () => {
      req.params = { id: "task123" };
      req.body = {
        title: "Updated Task",
        description: "Updated description",
        done: false,
        subtasks: [],
        tags: [],
        priority: 1,
        deadline: "01/01/2024",
      };

      // Mock the service to resolve successfully
      (tasksService.updateTask as jest.Mock).mockResolvedValue({
        title: "Updated Task",
        description: "Updated description",
        done: false,
        subtasks: [],
        tags: [],
        priority: 1,
        deadline: "01/01/2024",
      });

      await tasksController.updateTask(req as Request, res as Response);

      // Ensure sendStatus is called with 200
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 404 if the task is not found", async () => {
      const mockError = new Error("Task not found");
      (tasksService.updateTask as jest.Mock).mockRejectedValue(mockError);

      req.params = { id: "task123" };
      req.body = {
        title: "Updated Task",
        description: "Updated description",
        done: false,
        subtasks: [],
        tags: [],
        priority: 1,
        deadline: "01/01/2024",
      };

      await tasksController.updateTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Task not found" });
    });
  });

  describe("deleteTask", () => {
    it("should delete the task and return 204", async () => {
      req.params = { id: "task123" };

      await tasksController.deleteTask(req as Request, res as Response);

      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    it("should return 404 if the task is not found", async () => {
      const mockError = new Error("Task not found");
      (tasksService.deleteTask as jest.Mock).mockRejectedValue(mockError);

      req.params = { id: "task123" };

      await tasksController.deleteTask(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
    });
  });
});
