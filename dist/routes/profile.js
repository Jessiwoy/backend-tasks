"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const container_1 = __importDefault(require("../containers/container"));
const profileController = container_1.default.resolve("ProfileController");
const router = express_1.default.Router();
router.use(auth_1.default);
router.get("/", profileController.getProfile);
router.put("/avatar", profileController.updateAvatar);
router.put("/name", profileController.updateName);
router.post("/", profileController.createOrUpdateProfile);
router.delete("/delete-account", profileController.deleteAccount);
exports.default = router;
