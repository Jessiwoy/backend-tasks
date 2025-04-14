const admin = require("firebase-admin");
const db = admin.firestore();

const getUserTasks = async (uid) => {
  const snapshot = await db.collection("tasks").where("uid", "==", uid).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const createTask = async (task) => {
  const ref = await db.collection("tasks").add(task);
  return { id: ref.id };
};

const updateTask = async (id, data) => {
  const taskRef = db.collection("tasks").doc(id);
  const doc = await taskRef.get();

  if (!doc.exists) {
    throw new Error("Tarefa não encontrada");
  }

  await taskRef.update(data);
};

const deleteTask = async (id) => {
  await db.collection("tasks").doc(id).delete();
};

module.exports = { getUserTasks, createTask, updateTask, deleteTask };
