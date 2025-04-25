const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const usersController = require("../controllers/UsersController");

router.use(auth);

router.get("/search", usersController.search);

module.exports = router;
