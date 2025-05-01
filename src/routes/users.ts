import express from "express";
import auth from "../middleware/auth";
import UsersController from "../controllers/UsersController";
import container from "../containers/container";

const usersController = container.resolve<UsersController>("UsersController");

const router = express.Router();

router.use(auth);

router.get("/search", usersController.search);

export default router;
