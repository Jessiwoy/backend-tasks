import AuthController from "../../src/controllers/AuthController";
import { AuthService } from "../../src/services/AuthService";
import { Request, Response } from "express";
import { jest } from "@jest/globals";

describe("AuthController", () => {
  let authService: AuthService;
  let authController: AuthController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      refresh: jest.fn(),
    } as AuthService;

    authController = new AuthController(authService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis() as unknown as Response["status"],
      json: jest.fn() as Response["json"],
    };
  });

  describe("register", () => {
    it("should return 400 if required fields are missing", async () => {
      req.body = { email: "test@example.com", password: "123456" }; // Missing name and phone_number
      await authController.register(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Campos obrigatórios ausentes",
      });
    });

    it("should return 400 if phone number is invalid", async () => {
      req.body = {
        email: "test@example.com",
        password: "123456",
        name: "Test User",
        phone_number: "12345",
      }; // Invalid phone number
      await authController.register(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Número de telefone inválido. Use o padrão 11912345678.",
      });
    });

    it("should return 201 and call authService.register on success", async () => {
      req.body = {
        email: "test@example.com",
        password: "123456",
        name: "Test User",
        phone_number: "11912345678",
      };
      (
        authService.register as jest.Mock<AuthService["register"]>
      ).mockResolvedValue({ uid: "1", idToken: "1" });

      await authController.register(req as Request, res as Response);
      expect(authService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ uid: "1", idToken: "1" });
    });

    it("should return 400 if authService.register throws an error", async () => {
      req.body = {
        email: "test@example.com",
        password: "123456",
        name: "Test User",
        phone_number: "11912345678",
      };
      (
        authService.register as jest.Mock<AuthService["register"]>
      ).mockRejectedValue(new Error("Registration failed"));

      await authController.register(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Registration failed" });
    });
  });

  describe("login", () => {
    it("should return 400 if email or password is missing", async () => {
      req.body = { email: "test@example.com" }; // Missing password
      await authController.login(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Email e senha obrigatórios",
      });
    });

    it("should return user data on successful login", async () => {
      req.body = { email: "test@example.com", password: "123456" };
      (authService.login as jest.Mock<AuthService["login"]>).mockResolvedValue({
        id_token: "abc123",
        refresh_token: "xyz456",
      });

      await authController.login(req as Request, res as Response);
      expect(authService.login).toHaveBeenCalledWith(
        "test@example.com",
        "123456"
      );
      expect(res.json).toHaveBeenCalledWith({
        id_token: "abc123",
        refresh_token: "xyz456",
      });
    });

    it("should return 401 if login fails", async () => {
      req.body = { email: "test@example.com", password: "wrongpassword" };
      (authService.login as jest.Mock<AuthService["login"]>).mockRejectedValue(
        new Error("Invalid credentials")
      );

      await authController.login(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Email ou senha inválidos",
        falha: new Error("Invalid credentials"),
      });
    });
  });

  describe("refresh", () => {
    it("should return 400 if refreshToken is missing", async () => {
      req.body = {}; // Missing refreshToken
      await authController.refresh(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "refreshToken obrigatório",
      });
    });

    it("should return new token on successful refresh", async () => {
      req.body = { refreshToken: "validToken" };
      (
        authService.refresh as jest.Mock<AuthService["refresh"]>
      ).mockResolvedValue({
        idToken: "newToken",
        refreshToken: "newRefreshToken",
        expiresIn: 3600,
      });

      await authController.refresh(req as Request, res as Response);
      expect(authService.refresh).toHaveBeenCalledWith("validToken");
      expect(res.json).toHaveBeenCalledWith({
        idToken: "newToken",
        refreshToken: "newRefreshToken",
        expiresIn: 3600,
      });
    });

    it("should return 500 if refresh fails", async () => {
      req.body = { refreshToken: "invalidToken" };
      (
        authService.refresh as jest.Mock<AuthService["refresh"]>
      ).mockRejectedValue(new Error("Refresh failed"));

      await authController.refresh(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao renovar o token",
      });
    });
  });
});
