const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("firebase-admin");

router.use(auth);

router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query || typeof query !== "string" || query.trim() === "") {
    return res.status(400).json({ error: "Query inválida" });
  }

  const snapshot = await admin
    .firestore()
    .collection("users")
    .where("email", ">=", query)
    .where("email", "<=", query + "\uf8ff")
    .limit(10)
    .get();

  const results = snapshot.docs.map((doc) => ({
    email: doc.data().email,
    picture: doc.data().picture,
    name: doc.data().name,
  }));
  res.json(results);
});

module.exports = router;
