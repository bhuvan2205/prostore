import { LATEST_PRODUCTS_LIMIT } from "@/constants/products";
import { convertToPlainObject } from "@/lib/utils";
import { prisma } from "@/config/db";

export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: LATEST_PRODUCTS_LIMIT,
  });
  return convertToPlainObject(data);
};
