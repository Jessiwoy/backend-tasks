const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("firebase-admin");

router.use(auth);

router.get("/", async (req, res) => {
  const { uid, email, name } = req.user;

  const userRef = admin.firestore().collection("users").doc(uid);
  const doc = await userRef.get();

  const picture = doc.exists ? doc.data().picture : null;

  res.json({
    uid,
    email,
    name: name || null,
    picture: picture || null,
  });
});

router.put("/avatar", async (req, res) => {
  const { picture } = req.body;

  if (!picture || !/^avatar_\d$/.test(picture)) {
    return res.status(400).json({ error: "ID de avatar inválido" });
  }

  const userRef = admin.firestore().collection("users").doc(req.user.uid);
  await userRef.set({ picture }, { merge: true });

  res.sendStatus(200);
});

module.exports = router;
