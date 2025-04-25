const admin = require("firebase-admin");

class CommmentsService {
  db;
  constructor() {
    this.db = admin.firestore();
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

async function createComment({ taskId, content, author }) {
  await admin.firestore().collection("comments").add({
    taskId,
    content: content.trim(),
    author,
    created_at: new Date(),
  });
}

module.exports = CommmentsService;
