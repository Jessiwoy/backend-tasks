"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isValidDeadlineFormat_1 = require("../utils/isValidDeadlineFormat");
class TasksController {
    constructor(tasksService) {
        this.tasksService = tasksService;
        this.getTasks = this.getTasks.bind(this);
        this.createTask = this.createTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.shareTask = this.shareTask.bind(this);
    }
    async getTasks(req, res) {
        if (req.user.email === undefined) {
            res.status(400).json({ error: "Email do usuário não encontrado" });
            return;
        }
        try {
            const tasks = await this.tasksService.getUserTasks(req.user.uid, req.user.email);
            res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async createTask(req, res) {
        const { title, description = "", deadline } = req.body;
        if (!title || typeof title !== "string") {
            res.status(400).json({ error: "Título da tarefa é obrigatório" });
            return;
        }
        if (!(0, isValidDeadlineFormat_1.isValidDeadlineFormat)(deadline)) {
            res
                .status(400)
                .json({ error: "Formato de deadline inválido. Use dd/mm/yyyy." });
            return;
        }
        try {
            const task = {
                title,
                description,
                deadline,
                uid: req.user.uid,
                priority: 3,
                createdAt: new Date(),
                done: false,
            };
            const result = await this.tasksService.createTask(task);
            res.status(201).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async updateTask(req, res) {
        const { title, description, done, subtasks, tags, priority, deadline } = req.body;
        if (tags &&
            (!Array.isArray(tags) ||
                tags.length > 5 ||
                !tags.every((t) => typeof t === "string"))) {
            res
                .status(400)
                .json({ error: "Tags inválidas. Use no máximo 5 strings." });
            return;
        }
        if (subtasks &&
            (!Array.isArray(subtasks) ||
                !subtasks.every((st) => typeof st.title === "string" && typeof st.done === "boolean"))) {
            res.status(400).json({ error: "Formato de subtasks inválido" });
            return;
        }
        if (priority &&
            (typeof priority !== "number" || priority < 1 || priority > 3)) {
            res
                .status(400)
                .json({ error: "Prioridade deve ser um número entre 1 e 3" });
            return;
        }
        if (!(0, isValidDeadlineFormat_1.isValidDeadlineFormat)(deadline || "")) {
            res
                .status(400)
                .json({ error: "Formato de deadline inválido. Use dd/mm/yyyy." });
            return;
        }
        const dataToUpdate = {
            uid: req.user.uid,
        };
        if (title)
            dataToUpdate.title = title;
        if (description !== undefined)
            dataToUpdate.description = description;
        if (done !== undefined)
            dataToUpdate.done = done;
        if (subtasks !== undefined)
            dataToUpdate.subtasks = subtasks;
        if (tags !== undefined)
            dataToUpdate.tags = tags;
        if (priority !== undefined)
            dataToUpdate.priority = priority;
        if (deadline !== undefined)
            dataToUpdate.deadline = deadline;
        try {
            await this.tasksService.updateTask(req.params.id, dataToUpdate);
            res.sendStatus(200);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async deleteTask(req, res) {
        try {
            await this.tasksService.deleteTask(req.params.id, req.user.uid);
            res.sendStatus(204);
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async shareTask(req, res) {
        const { sharedWith } = req.body;
        if (!Array.isArray(sharedWith) ||
            !sharedWith.every((email) => typeof email === "string")) {
            res.status(400).json({ error: "Lista de e-mails inválida" });
            return;
        }
        try {
            const result = await this.tasksService.shareTask(req.params.id, sharedWith);
            if (result.invalidEmails.length > 0) {
                res.status(400).json({
                    error: "Os seguintes e-mails não existem na base de dados",
                    invalidEmails: result.invalidEmails,
                });
                return;
            }
            res.sendStatus(200);
        }
        catch (error) {
            res.status(403).json({ error: error.message });
        }
    }
}
exports.default = TasksController;
