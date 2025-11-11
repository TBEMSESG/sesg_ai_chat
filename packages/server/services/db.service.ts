import { reviewRepository } from '../repositories/db.repository';
import { llmClient } from '../llm/client';
import template from '../prompts/summarize-reviews.txt';

export const dbService = {
   async summarizeReviews(prod: number): Promise<string> {
      const existingSummary = await reviewRepository.getReviewSummary(prod);
      if (existingSummary) {
         return existingSummary;
      }

      const reviews = await reviewRepository.dbQuery(prod, 10);
      const jointReviews = reviews.map((r) => r.content).join(' \n\n ');

      const prompt = template.replace('{{reviews}}', jointReviews);

      const { text: summary } = await llmClient.generateText({
         model: 'gpt-5-nano',
         prompt,
         max_output_tokens: 500,
         reasoning: {
            effort: 'low',
         },
      });

      await reviewRepository.writeReview(prod, summary);
      return summary;
   },
};
