import { Router } from "express"
import healthRouter from "./health"
import authRouter from "./auth"
import friendRouter from "./friend"
import { authenticateToken } from "../middleware/auth"

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter)
router.use('/friend', authenticateToken, friendRouter)

export default router