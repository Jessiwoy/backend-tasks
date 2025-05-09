import admin from "firebase-admin";
import { Profile } from "../model/profileModel";
export interface ProfileService {
  getUserProfile: (uid: string) => Promise<Profile>;
  updateUserProfile: (profile: Profile) => Promise<void>;
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

  async updateUserProfile({
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
