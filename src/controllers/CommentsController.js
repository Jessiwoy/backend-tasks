const CommentService = require("../services/CommentsService");
const commentsService = new CommentService();

async function createComment(req, res) {
  const { taskId, content } = req.body;

  if (!taskId || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({ error: "Campos inválidos" });
  }
  try {
    commentsService.createComment({
      taskId,
      content,
      author: req.user.email,
    });
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({
      status_message: "Internal Server Error",
      message: error.message,
      error,
    });
  }
}

async function listComments(req, res) {
  const { taskId } = req.params;

  try {
    const comments = await commentsService.findByTaskId(taskId);
    if (comments.length === 0) {
      res.status(404).json({ message: "Nenhum comentário encontrado" });
      return;
    }
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      status_message: "Internal Server Error",
      message: error.message,
      error,
    });
  }
}

module.exports = {
  createComment,
  listComments,
};
