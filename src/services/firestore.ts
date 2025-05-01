import admin from "firebase-admin";
import { Task } from "../model/taskModel";
const db = admin.firestore();

const getUserTasks = async (uid: string, email: string): Promise<Task[]> => {
  const snapshot = await db
    .collection("tasks")
    .where("sharedWith", "array-contains-any", [email])
    .get();

  const sharedWithOwn: Task[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return { id: doc.id, ...data } as Task;
  });

  const own = await db.collection("tasks").where("uid", "==", uid).get();

  const ownTasks: Task[] = own.docs.map((doc) => {
    const data = doc.data();
    return { id: doc.id, ...data } as Task;
  });

  return [
    ...ownTasks,
    ...sharedWithOwn.filter(
      (sharedTask) => !ownTasks.find((ownTask) => ownTask.id === sharedTask.id)
    ),
  ];
};

const createTask = async (task: {
  title: string;
  description: string;
  createdAt: Date;
  uid: string;
}) => {
  const ref = await db.collection("tasks").add(task);
  return { id: ref.id };
};

const updateTask = async (
  id: string,
  data: {
    uid: string;
    tags?: string[];
    title?: string;
    description?: string;
    done?: boolean;
    subtasks?: { title: string; done: boolean }[];
  }
) => {
  const ref = db.collection("tasks").doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error("Tarefa não encontrada");
  const task = doc.data();

  if (task?.uid !== data.uid) throw new Error("Permissão negada");

  await ref.update(data);
};

const deleteTask = async (id: string, uid: string) => {
  const ref = db.collection("tasks").doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error("Tarefa não encontrada");
  if (doc.data()?.uid !== uid) throw new Error("Permissão negada");

  await ref.delete();
};

const shareTask = async (id: string, sharedWith: string[]) => {
  const ref = db.collection("tasks").doc(id);
  await ref.update({ sharedWith });
};

export default {
  getUserTasks,
  createTask,
  updateTask,
  deleteTask,
  shareTask,
};
