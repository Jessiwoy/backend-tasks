import admin from "firebase-admin";
import firestore from "./firestore";
import { Task } from "../model/taskModel";

interface TaskService {
  getUserTasks: (uid: string, email: string) => Promise<Task[]>;
  createTask: (task: {
    title: string;
    description: string;
    createdAt: Date;
    uid: string;
  }) => Promise<{ id: string }>;
  updateTask: (
    id: string,
    data: {
      uid: string;
      tags?: string[];
      title?: string;
      description?: string;
      done?: boolean;
      subtasks?: { title: string; done: boolean }[];
    }
  ) => Promise<void>;
  deleteTask: (id: string, uid: string) => Promise<void>;
  shareTask: (
    id: string,
    sharedWith: string[]
  ) => Promise<{ invalidEmails: string[] }>;
}

class TasksServiceImpl implements TaskService {
  async getUserTasks(uid: string, email: string) {
    return await firestore.getUserTasks(uid, email);
  }

  async createTask(task: {
    title: string;
    description: string;
    createdAt: Date;
    uid: string;
  }) {
    return await firestore.createTask(task);
  }

  async updateTask(
    id: string,
    data: {
      uid: string;
      tags?: string[];
      title?: string;
      description?: string;
      done?: boolean;
      subtasks?: { title: string; done: boolean }[];
    }
  ) {
    return await firestore.updateTask(id, data);
  }

  async deleteTask(id: string, uid: string) {
    return await firestore.deleteTask(id, uid);
  }

  async shareTask(id: string, sharedWith: string[]) {
    const snapshot = await admin
      .firestore()
      .collection("users")
      .where("email", "in", sharedWith)
      .get();

    const validEmails = snapshot.docs.map((doc) => doc.data().email);
    const invalidEmails = sharedWith.filter(
      (email) => !validEmails.includes(email)
    );

    if (invalidEmails.length > 0) {
      return { invalidEmails };
    }

    await firestore.shareTask(id, sharedWith);
    return { invalidEmails: [] };
  }
}

export default TasksServiceImpl;
