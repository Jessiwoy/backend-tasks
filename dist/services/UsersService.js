"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class UsersServiceImpl {
    constructor() {
        this.users = [];
        this.db = firebase_admin_1.default.firestore();
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
        this.users = snapshot.docs.map((doc) => ({
            email: doc.data().email,
            picture: doc.data().picture,
            name: doc.data().name,
        }));
        return this.users;
    }
}
exports.default = UsersServiceImpl;
