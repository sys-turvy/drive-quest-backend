import { Router } from 'express';
import shopController from '../controllers/shop';

const router = Router();

router.get('/voice-styles', shopController.getVoiceStylesStore);
router.get('/icon-frames', shopController.getIconFramesStore);
router.post('/purchase-icon-frame', shopController.purchaseIconFrame);
router.post('/purchase-voice-style', shopController.purchaseVoiceStyle);

export default router; 