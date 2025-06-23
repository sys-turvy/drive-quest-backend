import { Router } from "express";
import { UserProfileController } from "../controllers/userProfile";

const router = Router();
const controller = new UserProfileController();

router.get("/", controller.getProfile);
router.patch("/name", controller.updateName);
router.patch("/title", controller.updateTitle);
router.patch("/voice", controller.updateVoice);
router.patch("/icon-frame", controller.updateIconFrame);
router.patch("/icon", controller.updateIcon);
router.patch("/monthly-goal", controller.updateMonthlyGoal);
router.get("/titles", controller.getUserTitles);
router.get("/icon-frames", controller.getUserIconFrames);
router.get("/voice-styles", controller.getUserVoiceStyles);

export default router; 