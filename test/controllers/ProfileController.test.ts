import { DecodedIdToken } from "firebase-admin/auth";
import ProfileController from "../../src/controllers/ProfileController";
import { ProfileService } from "../../src/services/ProfileService";
import { Request, Response } from "express";

jest.mock("../../src/services/ProfileService");

describe("ProfileController", () => {
  let profileService: ProfileService;
  let profileController: ProfileController;
  let req: Partial<Request & { user: Partial<DecodedIdToken> }>;
  let res: Partial<Response>;

  beforeEach(() => {
    profileService = {
      getUserProfile: jest.fn(),
      updateUserProfile: jest.fn(),
      deleteUserAccount: jest.fn(),
    } as unknown as ProfileService;
    profileController = new ProfileController(profileService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  describe("getProfile", () => {
    it("should return user profile data", async () => {
      req.params = { uid: "123" };
      req.user = {
        email: "test@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "123",
      } as DecodedIdToken;

      (profileService.getUserProfile as jest.Mock).mockResolvedValue({
        name: "John Doe",
        phone_number: "11912345678",
        picture: "avatar_1",
      });

      await profileController.getProfile(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        uid: "123",
        email: "test@example.com",
        phone_number: "11912345678",
        name: "John Doe",
        picture: "avatar_1",
      });
    });

    it("should handle errors", async () => {
      req.user = {
        email: "test@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "123",
      } as DecodedIdToken;

      (profileService.getUserProfile as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      await profileController.getProfile(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao buscar perfil do usuário",
      });
    });
  });

  describe("updateProfile", () => {
    it("should update user profile successfully", async () => {
      req.user = {
        email: "test@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "123",
      } as DecodedIdToken;

      req.body = {
        name: "Jane Doe",
        phone_number: "11987654321",
        picture: "avatar_2",
      };

      await profileController.updateProfile(req as Request, res as Response);

      expect(profileService.updateUserProfile).toHaveBeenCalledWith({
        uid: "123",
        email: "test@example.com",
        name: "Jane Doe",
        phone_number: "11987654321",
        picture: "avatar_2",
      });
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should return 400 for invalid phone number", async () => {
      req.user = {
        email: "test@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "123",
      } as DecodedIdToken;
      req.body = {
        phone_number: "invalid",
        name: "Jane Doe",
        picture: "avatar_2",
      };

      await profileController.updateProfile(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Número de telefone inválido. Use o padrão 11912345678.",
      });
    });

    it("should return 400 for invalid avatar ID", async () => {
      req.user = {
        email: "test@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "123",
      } as DecodedIdToken;
      req.body = {
        phone_number: "11912345678",
        name: "Jane Doe",
        picture: "avatar_0",
      };

      await profileController.updateProfile(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "ID de avatar inválido" });
    });

    it("should return 400 for invalid name", async () => {
      req.user = {
        email: "test@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "123",
      } as DecodedIdToken;
      req.body = { phone_number: "11912345678", name: "", picture: "avatar_2" };

      await profileController.updateProfile(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Nome inválido" });
    });
  });

  describe("deleteAccount", () => {
    it("should delete user account successfully", async () => {
      req.user = {
        email: "test@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "123",
      } as DecodedIdToken;

      await profileController.deleteAccount(req as Request, res as Response);

      expect(profileService.deleteUserAccount).toHaveBeenCalledWith("123");
      expect(res.sendStatus).toHaveBeenCalledWith(200);
    });

    it("should handle errors", async () => {
      req.user = {
        email: "test@example.com",
        aud: "",
        auth_time: 0,
        exp: 0,
        firebase: {},
        iat: 0,
        iss: "",
        sub: "",
        uid: "123",
      } as DecodedIdToken;

      (profileService.deleteUserAccount as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      await profileController.deleteAccount(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao deletar conta do usuário",
      });
    });
  });
});
