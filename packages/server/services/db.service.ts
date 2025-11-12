import { reviewRepository } from '../repositories/db.repository';
import { llmClient } from '../llm/client';

export const dbService = {
   async summarizeReviews(prod: number): Promise<string> {
      const existingSummary = await reviewRepository.getReviewSummary(prod);
      if (existingSummary) {
         return existingSummary;
      }

      const reviews = await reviewRepository.dbQuery(prod, 10);
      const jointReviews = reviews.map((r) => r.content).join(' \n\n ');

      const summary = await llmClient.summarizeReviews(jointReviews);

      await reviewRepository.writeReview(prod, summary);
      return summary;
   },
};
