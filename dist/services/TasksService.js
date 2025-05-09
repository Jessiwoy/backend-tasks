"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firestore_1 = __importDefault(require("./firestore"));
class TasksServiceImpl {
    async getUserTasks(uid, email) {
        return await firestore_1.default.getUserTasks(uid, email);
    }
    async createTask(task) {
        return await firestore_1.default.createTask(task);
    }
    async updateTask(id, data) {
        return await firestore_1.default.updateTask(id, data);
    }
    async deleteTask(id, uid) {
        return await firestore_1.default.deleteTask(id, uid);
    }
    async shareTask(id, sharedWith) {
        const snapshot = await firebase_admin_1.default
            .firestore()
            .collection("users")
            .where("email", "in", sharedWith)
            .get();
        const validEmails = snapshot.docs.map((doc) => doc.data().email);
        const invalidEmails = sharedWith.filter((email) => !validEmails.includes(email));
        if (invalidEmails.length > 0) {
            return { invalidEmails };
        }
        await firestore_1.default.shareTask(id, sharedWith);
        return { invalidEmails: [] };
    }
}
exports.default = TasksServiceImpl;
