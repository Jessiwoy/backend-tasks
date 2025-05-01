import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { UserModel } from "../model/userModel";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const clientAuth = getAuth(firebaseApp);

export interface AuthService {
  register(
    user: Omit<UserModel, "picture">
  ): Promise<{ uid: string; idToken: string }>;
  login(
    email: string,
    password: string
  ): Promise<{ id_token: string; refresh_token: string }>;
  refresh(
    refreshToken: string
  ): Promise<{ idToken: string; refreshToken: string; expiresIn: number }>;
}

class AuthServiceImpl implements AuthService {
  async register({
    email,
    password,
    name,
    phone_number,
  }: Omit<UserModel, "picture">) {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email,
      name,
      picture: "avatar_1",
      phone_number,
    });

    const idToken = await admin.auth().createCustomToken(userRecord.uid);
    return { uid: userRecord.uid, idToken };
  }

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    const refreshToken = userCredential.user.refreshToken;
    return { id_token: token, refresh_token: refreshToken };
  }

  async refresh(refreshToken: string) {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);

    const firebaseRes = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      }
    );

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

export default AuthServiceImpl;
