import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required...')
      .max(1000, 'Prompt is too long, max 1000 char...'),
   conversationId: z.uuid(),
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parsedResult = chatSchema.safeParse(req.body);

      if (!parsedResult.success) {
         res.status(400).json(parsedResult.error.format());
      }

      try {
         const { prompt, conversationId } = req.body;
         const response = await chatService.sendMessage(prompt, conversationId);

         res.json({ message: response.message });
      } catch (err) {
         res.status(500).json({
            error: `Failed to generate response...( ${err} )`,
         });
      }
   },
};
