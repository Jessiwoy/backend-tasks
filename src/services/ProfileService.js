const admin = require("firebase-admin");

class ProfileService {
  static async getUserProfile(uid) {
    const userRef = admin.firestore().collection("users").doc(uid);
    const doc = await userRef.get();
    return doc.exists ? doc.data() : {};
  }

  static async updateUserAvatar(uid, picture) {
    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.set({ picture }, { merge: true });
  }

  static async updateUserName(uid, name) {
    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.set({ name: name.trim() }, { merge: true });
  }

  static async createOrUpdateUserProfile(uid, email, name, phone, picture) {
    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.set(
      {
        name: name.trim(),
        picture,
        email,
        phone: phone.trim(),
      },
      { merge: true }
    );
  }
}

module.exports = ProfileService;
