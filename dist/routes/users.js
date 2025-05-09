"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const container_1 = __importDefault(require("../containers/container"));
const usersController = container_1.default.resolve("UsersController");
const router = express_1.default.Router();
router.use(auth_1.default);
router.get("/search", usersController.search);
exports.default = router;
