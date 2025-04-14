const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("firebase-admin");

router.use(auth);

router.get("/", async (req, res) => {
  const { uid, email } = req.user;
  const userRef = admin.firestore().collection("users").doc(uid);
  const doc = await userRef.get();

  const data = doc.exists ? doc.data() : {};

  res.json({
    uid,
    email,
    name: data.name || null,
    picture: data.picture || null,
  });
});

router.put("/avatar", async (req, res) => {
  const { picture } = req.body;

  if (!picture || !/^avatar_[1-5]$/.test(picture)) {
    return res.status(400).json({ error: "ID de avatar inválido" });
  }

  const userRef = admin.firestore().collection("users").doc(req.user.uid);
  await userRef.set({ picture }, { merge: true });

  res.sendStatus(200);
});

router.put("/name", async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Nome inválido" });
  }

  const userRef = admin.firestore().collection("users").doc(req.user.uid);
  await userRef.set({ name: name.trim() }, { merge: true });

  res.sendStatus(200);
});

module.exports = router;
