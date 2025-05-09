"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
class AuthServiceImpl {
    constructor() {
        this.apiConfig = {
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            projectId: process.env.PROJECT_ID,
        };
        this.firebaseApp = (0, app_1.initializeApp)(this.apiConfig);
        this.clientAuth = (0, auth_1.getAuth)(this.firebaseApp);
    }
    async register({ email, password, name, phone_number, }) {
        const userRecord = await firebase_admin_1.default.auth().createUser({
            email,
            password,
            displayName: name,
        });
        await firebase_admin_1.default.firestore().collection("users").doc(userRecord.uid).set({
            email,
            name,
            picture: "avatar_1",
            phone_number,
        });
        const idToken = await firebase_admin_1.default.auth().createCustomToken(userRecord.uid);
        return { uid: userRecord.uid, idToken };
    }
    async login(email, password) {
        // lidar com o erro de login
        const userCredential = await (0, auth_1.signInWithEmailAndPassword)(this.clientAuth, email, password).catch((error) => {
            throw new Error("Email ou senha inválidos");
        });
        if (!userCredential) {
            throw new Error("Email ou senha inválidos");
        }
        // Obter o token de ID e o token de atualização
        if (!userCredential.user) {
            throw new Error("Erro ao obter credenciais do usuário");
        }
        if (!userCredential.user.getIdToken) {
            throw new Error("Erro ao obter token de ID");
        }
        if (!userCredential.user.refreshToken) {
            throw new Error("Erro ao obter token de atualização");
        }
        const token = await userCredential.user.getIdToken();
        const refreshToken = userCredential.user.refreshToken;
        return { id_token: token, refresh_token: refreshToken };
    }
    async refresh(refreshToken) {
        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", refreshToken);
        const firebaseRes = await fetch(`https://securetoken.googleapis.com/v1/token?key=${process.env.API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
        });
        if (!firebaseRes.ok) {
            throw new Error("refreshToken inválido ou expirado");
        }
        const data = await firebaseRes.json();
        return {
            idToken: data.id_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in,
        };
    }
}
exports.default = AuthServiceImpl;
