import { Router } from "express"
import healthRouter from "./health"
import authRouter from "./auth"
import friendRouter from "./friend"
import driveHistoryRouter from "./driveHistory"
import profileRouter from "./profile"
import { authenticateToken } from "../middleware/auth"
import shopRoutes from './shop'
import rankingRoutes from './ranking'

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter)
router.use('/friend', authenticateToken, friendRouter)
router.use('/driveHistory', authenticateToken, driveHistoryRouter)
router.use('/profile', authenticateToken, profileRouter)
router.use('/shop',authenticateToken, shopRoutes)
router.use('/ranking', authenticateToken, rankingRoutes)

export default router