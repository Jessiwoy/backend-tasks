const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const commentsController = require("../controllers/CommentsController");

router.use(auth);

router.post("/", commentsController.createComment);

router.get("/:taskId", commentsController.listComments);

module.exports = router;
