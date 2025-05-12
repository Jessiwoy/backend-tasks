import { Request, Response } from "express";
import UsersController from "../../src/controllers/UsersController";
import { UsersService } from "../../src/services/UsersService";

describe("UsersController", () => {
  let usersService: UsersService;
  let usersController: UsersController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    usersService = {
      search: jest.fn(),
    } as unknown as UsersService;

    usersController = new UsersController(usersService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 400 if query is invalid", async () => {
    req.query = { query: "" };

    await usersController.search(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Query inválida" });
  });

  it("should return 404 if no users are found", async () => {
    req.query = { query: "test" };
    (usersService.search as jest.Mock).mockResolvedValue([]);

    await usersController.search(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Nenhum usuário encontrado",
    });
  });

  it("should return 200 with users if users are found", async () => {
    req.query = { query: "test" };
    const mockUsers = [{ id: 1, name: "User1" }];
    (usersService.search as jest.Mock).mockResolvedValue(mockUsers);

    await usersController.search(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it("should return 500 if an error occurs", async () => {
    req.query = { query: "test" };
    const mockError = new Error("Something went wrong");
    (usersService.search as jest.Mock).mockRejectedValue(mockError);

    await usersController.search(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status_message: "Internal Server Error",
      message: mockError.message,
      error: mockError,
    });
  });
});
