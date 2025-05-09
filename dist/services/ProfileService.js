"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class ProfileServiceImpl {
    async getUserProfile(uid) {
        const userRef = firebase_admin_1.default.firestore().collection("users").doc(uid);
        const doc = await userRef.get();
        if (!doc.exists) {
            throw new Error("User not found");
        }
        return doc.data();
    }
    async updateUserProfile({ uid, email, name, phone_number, picture, }) {
        const userRef = firebase_admin_1.default.firestore().collection("users").doc(uid);
        await userRef.set({
            name: name.trim(),
            picture,
            email,
            phone_number: phone_number.trim(),
        }, { merge: true });
    }
    async deleteUserAccount(uid) {
        const userRef = firebase_admin_1.default.firestore().collection("users").doc(uid);
        await userRef.delete();
        firebase_admin_1.default.auth().deleteUser(uid);
    }
}
exports.default = ProfileServiceImpl;
