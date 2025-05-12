import CommentsController from "../../src/controllers/CommentsController";
import { CommentService } from "../../src/services/CommentsService";
import { Request, Response } from "express";
import { jest } from "@jest/globals";
import { DecodedIdToken } from "firebase-admin/auth";
import { Comment } from "../../src/model/commentModel";

describe("CommentsController", () => {
  let commentsService: CommentService;
  let commentsController: CommentsController;
  let req: Partial<Request & { user: Partial<DecodedIdToken> }>;
  let res: Partial<Response>;

  beforeEach(() => {
    commentsService = {
      createComment: jest.fn(),
      findByTaskId: jest.fn(),
    } as unknown as CommentService;

    commentsController = new CommentsController(commentsService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis() as unknown as Response["status"],
      json: jest.fn() as unknown as Response["json"],
      sendStatus: jest.fn() as unknown as Response["sendStatus"],
    };
  });

  describe("createComment", () => {
    it("should return 400 if required fields are missing", async () => {
      req.body = { content: "Test comment" };
      req.user = {
        email: "user@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "",
      } as DecodedIdToken;

      await commentsController.createComment(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Campos inválidos" });
    });

    it("should return 401 if user is not authenticated", async () => {
      req.body = { taskId: "123", content: "Test comment" };
      req.user = {
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "",
      } as DecodedIdToken;

      await commentsController.createComment(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Usuário não autenticado",
      });
    });

    it("should return 201 on successful comment creation", async () => {
      req.body = { taskId: "123", content: "Test comment" };
      req.user = {
        email: "user@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "",
      } as DecodedIdToken;

      await commentsController.createComment(req as Request, res as Response);
      expect(commentsService.createComment).toHaveBeenCalledWith({
        taskId: "123",
        content: "Test comment",
        author: "user@example.com",
      });
      expect(res.sendStatus).toHaveBeenCalledWith(201);
    });

    it("should return 500 if comment creation fails", async () => {
      req.body = { taskId: "123", content: "Test comment" };
      req.user = {
        email: "user@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "",
      } as DecodedIdToken;
      (commentsService.createComment as jest.Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      await commentsController.createComment(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status_message: "Internal Server Error",
        message: "Database error",
        error: new Error("Database error"),
      });
    });
  });

  describe("listComments", () => {
    it("should return 404 if taskId is missing", async () => {
      req.params = {};

      await commentsController.listComments(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "taskId is required" });
    });

    it("should return 404 if taskId is not a string", async () => {
      req.params = { taskId: 123 as unknown as string };

      await commentsController.listComments(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "taskId must be a string",
      });
    });

    it("should return 404 if no comments are found", async () => {
      req.params = { taskId: "123" };
      (
        commentsService.findByTaskId as jest.Mock<
          CommentService["findByTaskId"]
        >
      ).mockResolvedValue([]);

      await commentsController.listComments(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Nenhum comentário encontrado",
      });
    });

    it("should return 200 with comments if found", async () => {
      req.params = { taskId: "123" };
      const comments: Comment[] = [
        {
          id: "1",
          createdAt: new Date(),
          taskId: "123",
          content: "Test comment",
          author: "Gabriel",
        },
      ];
      (
        commentsService.findByTaskId as jest.Mock<
          CommentService["findByTaskId"]
        >
      ).mockResolvedValue(comments);

      await commentsController.listComments(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(comments);
    });

    it("should return 500 if fetching comments fails", async () => {
      req.params = { taskId: "123" };
      (commentsService.findByTaskId as jest.Mock).mockImplementation(() => {
        throw new Error("Database error");
      });

      await commentsController.listComments(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status_message: "Internal Server Error",
        message: "Database error",
        error: new Error("Database error"),
      });
    });
  });
});
