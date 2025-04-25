const admin = require("firebase-admin");

class UsersService {
  db;
  constructor() {
    this.db = admin.firestore();
  }
  async search(query) {
    const snapshot = await this.db
      .collection("users")
      .where("email", ">=", query)
      .where("email", "<=", query + "\uf8ff")
      .limit(10)
      .get();

    if (snapshot.empty) {
      return [];
    }

    const results = snapshot.docs.map((doc) => ({
      email: doc.data().email,
      picture: doc.data().picture,
      name: doc.data().name,
    }));
    return results;
  }
}

module.exports = UsersService;
