"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const CommentsController_1 = __importDefault(require("../controllers/CommentsController"));
const ProfileController_1 = __importDefault(require("../controllers/ProfileController"));
const TasksController_1 = __importDefault(require("../controllers/TasksController"));
const UsersController_1 = __importDefault(require("../controllers/UsersController"));
const AuthService_1 = __importDefault(require("../services/AuthService"));
const CommentsService_1 = __importDefault(require("../services/CommentsService"));
const ProfileService_1 = __importDefault(require("../services/ProfileService"));
const TasksService_1 = __importDefault(require("../services/TasksService"));
const UsersService_1 = __importDefault(require("../services/UsersService"));
class Container {
    constructor() {
        this.instance = {};
    }
    register(key, instance) {
        this.instance[key] = instance;
    }
    resolve(key) {
        return this.instance[key];
    }
}
const container = new Container();
container.register("AuthService", new AuthService_1.default());
container.register("AuthController", new AuthController_1.default(container.resolve("AuthService")));
container.register("CommentsService", new CommentsService_1.default());
container.register("CommentsController", new CommentsController_1.default(container.resolve("CommentsService")));
container.register("ProfileService", new ProfileService_1.default());
container.register("ProfileController", new ProfileController_1.default(container.resolve("ProfileService")));
container.register("TasksService", new TasksService_1.default());
container.register("TasksController", new TasksController_1.default(container.resolve("TasksService")));
container.register("UsersService", new UsersService_1.default());
container.register("UsersController", new UsersController_1.default(container.resolve("UsersService")));
exports.default = container;
