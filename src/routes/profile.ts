import express from "express";
import auth from "../middleware/auth";
import ProfileController from "../controllers/ProfileController";
import ProfileServiceImpl from "../services/ProfileService";

const profileController = new ProfileController(new ProfileServiceImpl());

const router = express.Router();

router.use(auth);

router.get("/", profileController.getProfile);

router.put("/avatar", profileController.updateAvatar);

router.put("/name", profileController.updateName);

router.post("/", profileController.createOrUpdateProfile);

export default router;
