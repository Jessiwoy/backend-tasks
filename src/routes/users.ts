import express from "express";
import auth from "../middleware/auth";
import UsersController from "../controllers/UsersController";
import UsersServiceImpl from "../services/UsersService";

const usersController = new UsersController(new UsersServiceImpl());

const router = express.Router();

router.use(auth);

router.get("/search", usersController.search);

export default router;
