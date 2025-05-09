"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const container_1 = __importDefault(require("../containers/container"));
const authController = container_1.default.resolve("AuthController");
const router = express_1.default.Router();
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
exports.default = router;
