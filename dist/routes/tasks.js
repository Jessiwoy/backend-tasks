"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const container_1 = __importDefault(require("../containers/container"));
const tasksController = container_1.default.resolve("TasksController");
const router = (0, express_1.Router)();
router.use(auth_1.default);
router.get("/", tasksController.getTasks);
router.post("/", tasksController.createTask);
router.put("/:id", tasksController.updateTask);
router.delete("/:id", tasksController.deleteTask);
router.put("/:id/share", tasksController.shareTask);
exports.default = router;
