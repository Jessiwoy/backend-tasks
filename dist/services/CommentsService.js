"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class CommentsServiceImpl {
    constructor() {
        this.db = firebase_admin_1.default.firestore();
    }
    async createComment({ taskId, content, author }) {
        return await this.db.collection("comments").add({
            taskId,
            content: content.trim(),
            author,
            createdAt: new Date(),
        });
    }
    async findByTaskId(taskId) {
        const snapshot = await this.db
            .collection("comments")
            .where("taskId", "==", taskId)
            .orderBy("createdAt", "asc")
            .get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
}
exports.default = CommentsServiceImpl;
