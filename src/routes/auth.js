const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const clientAuth = getAuth(firebaseApp);

router.post("/register", async (req, res) => {
  const { email, password, name, phone_number } = req.body;

  if (!email || !password || !name || !phone_number) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  }

  try {
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
    res.status(201).json({ uid: userRecord.uid, idToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    const refreshToken = userCredential.user.refreshToken;
    res.json({ id_token: token, refresh_token: refreshToken });
  } catch (err) {
    res.status(401).json({ error: "Email ou senha inválidos" });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken obrigatório" });
  }

  try {
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
      return res
        .status(401)
        .json({ error: "refreshToken inválido ou expirado" });
    }

    const data = await firebaseRes.json();

    res.json({
      idToken: data.id_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao renovar o token" });
  }
});

module.exports = router;
