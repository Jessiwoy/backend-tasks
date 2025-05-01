import express from "express";
import auth from "../middleware/auth";
import CommentsController from "../controllers/CommentsController";
import CommentsServiceImpl from "../services/CommentsService";

const router = express.Router();
const commentsController = new CommentsController(new CommentsServiceImpl());

router.use(auth);

router.post("/", commentsController.createComment);

router.get("/:taskId", commentsController.listComments);

export default router;
