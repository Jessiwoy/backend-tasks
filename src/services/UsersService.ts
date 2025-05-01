import admin, { firestore } from "firebase-admin";
import { User } from "../model/userModel";

export interface UsersService {
  search(query: string): Promise<User[]>;
}

class UsersServiceImpl implements UsersService {
  private db: firestore.Firestore;
  private users: User[] = [];

  constructor() {
    this.db = admin.firestore();
  }
  async search(query: string) {
    const snapshot = await this.db
      .collection("users")
      .where("email", ">=", query)
      .where("email", "<=", query + "\uf8ff")
      .limit(10)
      .get();

    if (snapshot.empty) {
      return [];
    }

    this.users = snapshot.docs.map((doc) => ({
      email: doc.data().email,
      picture: doc.data().picture,
      name: doc.data().name,
    }));
    return this.users;
  }
}

export default UsersServiceImpl;
