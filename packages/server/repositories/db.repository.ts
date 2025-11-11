import dayjs from 'dayjs';
import { PrismaClient, type Review } from '../generated/prisma/client';

const prisma = new PrismaClient();

export const reviewRepository = {
   async dbQuery(prod: number, limit?: number): Promise<Review[]> {
      const productId = prod;

      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },

   async writeReview(prod: number, summary: string) {
      const productId = prod;
      const now = new Date();
      const expiresAt = dayjs().add(7, 'days').toDate();
      const data = { content: summary, expiresAt, generatedAt: now, productId };

      return prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },

   async getReviewSummary(prod: number): Promise<string | null> {
      const productId = prod;
      const summary = await prisma.summary.findFirst({
         where: {
            AND: [{ productId }, { expiresAt: { gt: new Date() } }],
         },
      });

      return summary ? summary.content : null;
   },
};
