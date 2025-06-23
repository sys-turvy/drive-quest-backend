import { Router } from 'express';
import shopController from '../controllers/shop';

const router = Router();

router.get('/voice-styles', shopController.getVoiceStylesStore);
router.get('/icon-frames', shopController.getIconFramesStore);

export default router; 