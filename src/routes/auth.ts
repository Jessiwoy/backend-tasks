import express from "express";
import AuthController from "../controllers/AuthController";
import container from "../containers/container";

const authController = container.resolve<AuthController>("AuthController");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

export default router;
