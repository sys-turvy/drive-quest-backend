import { Router } from "express";
import { DriveHistoryController } from "../controllers/driveHistory";

const router = Router();
const driveHistoryController = new DriveHistoryController();

router.get("/", driveHistoryController.getDriveHistory);
router.post("/", driveHistoryController.addDriveHistory);

export default router; 