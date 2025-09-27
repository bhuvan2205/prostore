import { MAP_BANNER_IMAGE, MAP_IMAGE } from "@/data/sample-data";
import { Prisma } from "@prisma/client";

export const getRandomImageArray = () => {
  const keys = Object.keys(MAP_IMAGE);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return MAP_IMAGE[randomKey as keyof typeof MAP_IMAGE];
};

export const getRandomBannerImage = () => {
  const keys = Object.keys(MAP_BANNER_IMAGE);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return MAP_BANNER_IMAGE[randomKey as keyof typeof MAP_BANNER_IMAGE];
};

export const getProductSortOrder = (
  sort?: string
): Prisma.ProductOrderByWithRelationInput => {
  switch (sort) {
    case "lowest":
      return { price: "asc" };
    case "highest":
      return { price: "desc" };
    case "rating":
      return { rating: "desc" };
    default:
      return { createdAt: "desc" };
  }
};
