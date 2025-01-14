import { LATEST_PRODUCTS_LIMIT } from "@/constants/products";
import { convertToPlainObject } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

export const getLatestProducts = async () => {
  const prisma = new PrismaClient();
  const data = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: LATEST_PRODUCTS_LIMIT,
  });
  return convertToPlainObject(data);
};
