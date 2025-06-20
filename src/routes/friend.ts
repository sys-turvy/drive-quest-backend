import { Router } from "express";
import { FriendController } from "../controllers/friend";

const router = Router();
const friendController = new FriendController();

router.post("/", friendController.addFriend);
router.get("/", friendController.getFriends);

export default router; 