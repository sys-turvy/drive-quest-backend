import { Router } from "express";
import { UserProfileController } from "../controllers/userProfile";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const controller = new UserProfileController();

router.get("/", authenticateToken, controller.getProfile);
router.patch("/name", authenticateToken, controller.updateName);
router.patch("/title", authenticateToken, controller.updateTitle);
router.patch("/voice", authenticateToken, controller.updateVoice);
router.patch("/icon-frame", authenticateToken, controller.updateIconFrame);
router.patch("/icon", authenticateToken, controller.updateIcon);
router.patch("/monthly-goal", authenticateToken, controller.updateMonthlyGoal);

export default router; 