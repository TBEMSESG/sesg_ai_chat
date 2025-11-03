import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { chatController } from './controllers/chat.controller';

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
   res.send('Hello World!!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hallo World!' });
});

app.post('/api/chat', chatController.sendMessage);

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
