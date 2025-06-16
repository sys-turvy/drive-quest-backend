import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.json({ state: 'OK' });
});

export default router;