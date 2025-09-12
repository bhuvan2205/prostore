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

export const getSingleProductBySlug = async (slug: string) => {
  return await prisma.product.findFirst({
    where: {
      slug,
    },
  });
};

export const getSingleProductById = async (productId: string) => {
  const data = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });

  return convertToPlainObject(data);
};
