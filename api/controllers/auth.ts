import { Router, Request, Response } from 'express';

const router = Router();

// Example route: GET /auth/test
router.get('/test', (req: Request, res: Response) => {
	res.json({ message: 'Auth route works!' });
});

export default router;
