import express from "express";
import AuthController from "../controllers/AuthController";
import AuthServiceImpl from "../services/AuthService";

const authController = new AuthController(new AuthServiceImpl());

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

export default router;
