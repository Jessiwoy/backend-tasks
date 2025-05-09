"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const db = firebase_admin_1.default.firestore();
const getUserTasks = async (uid, email) => {
    const snapshot = await db
        .collection("tasks")
        .where("sharedWith", "array-contains-any", [email])
        .get();
    const sharedWithOwn = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
    });
    const own = await db.collection("tasks").where("uid", "==", uid).get();
    const ownTasks = own.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
    });
    return [
        ...ownTasks,
        ...sharedWithOwn.filter((sharedTask) => !ownTasks.find((ownTask) => ownTask.id === sharedTask.id)),
    ];
};
const createTask = async (task) => {
    const ref = await db.collection("tasks").add(task);
    return { id: ref.id };
};
const updateTask = async (id, data) => {
    const ref = db.collection("tasks").doc(id);
    const doc = await ref.get();
    if (!doc.exists)
        throw new Error("Tarefa não encontrada");
    const task = doc.data();
    if (task?.uid !== data.uid)
        throw new Error("Permissão negada");
    await ref.update(data);
};
const deleteTask = async (id, uid) => {
    const ref = db.collection("tasks").doc(id);
    const doc = await ref.get();
    if (!doc.exists)
        throw new Error("Tarefa não encontrada");
    if (doc.data()?.uid !== uid)
        throw new Error("Permissão negada");
    await ref.delete();
};
const shareTask = async (id, sharedWith) => {
    const ref = db.collection("tasks").doc(id);
    await ref.update({ sharedWith });
};
exports.default = {
    getUserTasks,
    createTask,
    updateTask,
    deleteTask,
    shareTask,
};
