import { reviewRepository } from '../repositories/db.repository';
import { productRepository } from '../repositories/product.repository';
import { dbService } from '../services/db.service';
import type { Request, Response } from 'express';

export const DbController = {
   async getReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Product Id is must be a number!' });
         return;
      }

      const product = await productRepository.getProduct(productId);
      if (!product) {
         res.status(404).json({ error: 'Product not found!' });
         return;
      }

      const reviews = await reviewRepository.dbQuery(productId);
      const summary = await reviewRepository.getReviewSummary(productId);

      res.json({
         summary,
         reviews,
      });
   },

   async summarizeReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Product Id is must be a number' });
         return;
      }

      const product = await productRepository.getProduct(productId);
      if (!product) {
         res.status(400).json({ error: `Product doesn't exists` });
         return;
      }

      const reviews = await reviewRepository.dbQuery(productId, 1);
      if (reviews.length == 0) {
         res.status(400).json({ error: `There are no reviews to summarize` });
         return;
      }

      const summary = await dbService.summarizeReviews(productId);

      res.json({ summary });
   },
};
