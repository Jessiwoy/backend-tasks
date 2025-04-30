const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ProfileController = require("../controllers/ProfileController");

router.use(auth);

router.get("/", ProfileController.getProfile);

router.put("/avatar", ProfileController.updateAvatar);

router.put("/name", ProfileController.updateName);

router.post("/", ProfileController.createOrUpdateProfile);

module.exports = router;
