import admin from "firebase-admin";
import { Profile } from "../model/profileModel";
export interface ProfileService {
  getUserProfile: (uid: string) => Promise<Profile>;
  updateUserAvatar: (uid: string, picture: string) => Promise<void>;
  updateUserName: (uid: string, name: string) => Promise<void>;
  createOrUpdateUserProfile: (profile: Profile) => Promise<void>;
  deleteUserAccount: (uid: string) => Promise<void>;
}

class ProfileServiceImpl implements ProfileService {
  async getUserProfile(uid: string): Promise<Profile> {
    const userRef = admin.firestore().collection("users").doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      throw new Error("User not found");
    }
    return doc.data() as Profile;
  }

  async updateUserAvatar(uid: string, picture: string) {
    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.set({ picture }, { merge: true });
  }

  async updateUserName(uid: string, name: string) {
    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.set({ name: name.trim() }, { merge: true });
  }

  async createOrUpdateUserProfile({
    uid,
    email,
    name,
    phone_number,
    picture,
  }: Profile) {
    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.set(
      {
        name: name.trim(),
        picture,
        email,
        phone_number: phone_number.trim(),
      },
      { merge: true }
    );
  }

  async deleteUserAccount(uid: string) {
    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.delete();
    admin.auth().deleteUser(uid);
  }
}

export default ProfileServiceImpl;
