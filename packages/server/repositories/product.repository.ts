import { PrismaClient, type Summary } from '../generated/prisma/client';

const prisma = new PrismaClient();

export const productRepository = {
   async getProduct(productId: number) {
      return prisma.product.findUnique({
         where: { id: productId },
      });
   },
};
