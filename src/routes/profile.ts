import express from "express";
import auth from "../middleware/auth";
import ProfileController from "../controllers/ProfileController";
import container from "../containers/container";

const profileController =
  container.resolve<ProfileController>("ProfileController");

const router = express.Router();

router.use(auth);

router.get("/", profileController.getProfile);

router.put("/", profileController.updateProfile);

router.delete("/delete-account", profileController.deleteAccount);

export default router;
