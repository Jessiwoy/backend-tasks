import admin from "firebase-admin";
import { BaseComment, Comment } from "../model/commentModel";

export interface CommentService {
  createComment({
    taskId,
    content,
    author,
  }: BaseComment): Promise<admin.firestore.DocumentReference>;
  findByTaskId(taskId: string): Promise<Comment[]>;
}

class CommentsServiceImpl implements CommentService {
  private db: admin.firestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  async createComment({ taskId, content, author }: BaseComment) {
    return await this.db.collection("comments").add({
      taskId,
      content: content.trim(),
      author,
      createdAt: new Date(),
    });
  }
  async findByTaskId(taskId: string): Promise<Comment[]> {
    const snapshot = await this.db
      .collection("comments")
      .where("taskId", "==", taskId)
      .orderBy("createdAt", "asc")
      .get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Comment)
    );
  }
}

export default CommentsServiceImpl;
