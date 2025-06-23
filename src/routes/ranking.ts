import { Router } from 'express';
import rankingController from '../controllers/ranking';

const router = Router();

router.get('/weekly-friends', rankingController.getWeeklyFriendRanking);
router.get('/monthly-friends', rankingController.getMonthlyFriendRanking);

export default router; 