const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const fetch = require("node-fetch");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const clientAuth = getAuth(firebaseApp);

class AuthService {
  static async register(email, password, name, phone_number) {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      email,
      name,
      picture: null,
      phone_number,
    });

    const idToken = await admin.auth().createCustomToken(userRecord.uid);
    return { uid: userRecord.uid, idToken };
  }

  static async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    const refreshToken = userCredential.user.refreshToken;
    return { id_token: token, refresh_token: refreshToken };
  }

  static async refresh(refreshToken) {
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

module.exports = AuthService;
