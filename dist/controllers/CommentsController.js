"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
        this.createComment = this.createComment.bind(this);
        this.listComments = this.listComments.bind(this);
    }
    async createComment(req, res) {
        const { taskId, content } = req.body;
        if (!taskId || typeof content !== "string" || content.trim() === "") {
            res.status(400).json({ error: "Campos inválidos" });
            return;
        }
        if (req.user.email === undefined) {
            res.status(401).json({ error: "Usuário não autenticado" });
            return;
        }
        try {
            this.commentsService.createComment({
                taskId,
                content,
                author: req.user.email,
            });
            res.sendStatus(201);
        }
        catch (error) {
            res.status(500).json({
                status_message: "Internal Server Error",
                message: error.message,
                error,
            });
        }
    }
    async listComments(req, res) {
        const { taskId } = req.params;
        if (!taskId) {
            res.status(404).json({ message: "taskId is required" });
            return;
        }
        if (typeof taskId !== "string") {
            res.status(404).json({ message: "taskId must be a string" });
            return;
        }
        try {
            const comments = await this.commentsService.findByTaskId(taskId);
            if (comments.length === 0) {
                res.status(404).json({ message: "Nenhum comentário encontrado" });
                return;
            }
            res.status(200).json(comments);
        }
        catch (error) {
            res.status(500).json({
                status_message: "Internal Server Error",
                message: error.message,
                error,
            });
        }
    }
}
exports.default = CommentsController;
