import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { DbController } from './controllers/db.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('Hello World!!');
});

router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hallo World!' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', DbController.getReviews);
router.post(
   '/api/products/:id/reviews/summarize',
   DbController.summarizeReviews
);

export default router;
