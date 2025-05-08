import AuthController from "../controllers/AuthController";
import CommentsController from "../controllers/CommentsController";
import ProfileController from "../controllers/ProfileController";
import TasksController from "../controllers/TasksController";
import UsersController from "../controllers/UsersController";

import AuthServiceImpl from "../services/AuthService";
import CommentsServiceImpl from "../services/CommentsService";
import ProfileServiceImpl from "../services/ProfileService";
import TasksServiceImpl from "../services/TasksService";
import UsersServiceImpl from "../services/UsersService";

class Container {
  private instance: Record<string, any> = {};

  register(key: string, instance: any) {
    this.instance[key] = instance;
  }

  resolve<T>(key: string): T {
    return this.instance[key];
  }
}

const container = new Container();
container.register("AuthService", new AuthServiceImpl());
container.register(
  "AuthController",
  new AuthController(container.resolve("AuthService"))
);

container.register("CommentsService", new CommentsServiceImpl());
container.register(
  "CommentsController",
  new CommentsController(container.resolve("CommentsService"))
);

container.register("ProfileService", new ProfileServiceImpl());
container.register(
  "ProfileController",
  new ProfileController(container.resolve("ProfileService"))
);

container.register("TasksService", new TasksServiceImpl());
container.register(
  "TasksController",
  new TasksController(container.resolve("TasksService"))
);

container.register("UsersService", new UsersServiceImpl());
container.register(
  "UsersController",
  new UsersController(container.resolve("UsersService"))
);

export default container;
