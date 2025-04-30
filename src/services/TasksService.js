const admin = require("firebase-admin");
const firestore = require("./firestore");

class TasksService {
  static async getUserTasks(uid, email) {
    return await firestore.getUserTasks(uid, email);
  }

  static async createTask(task) {
    return await firestore.createTask(task);
  }

  static async updateTask(id, data) {
    return await firestore.updateTask(id, data);
  }

  static async deleteTask(id, uid) {
    return await firestore.deleteTask(id, uid);
  }

  static async shareTask(id, sharedWith) {
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

module.exports = TasksService;
