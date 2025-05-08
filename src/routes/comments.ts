import express from "express";
import auth from "../middleware/auth";
import CommentsController from "../controllers/CommentsController";
import container from "../containers/container";

const router = express.Router();
const commentsController =
  container.resolve<CommentsController>("CommentsController");

router.use(auth);

router.post("/", commentsController.createComment);

router.get("/:taskId", commentsController.listComments);

export default router;
