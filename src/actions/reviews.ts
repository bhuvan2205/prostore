"use server";

import { auth } from "@/config/auth";
import { prisma } from "@/config/db";
import { ROUTES } from "@/constants/routes";
import { formatErrors } from "@/lib/utils";
import { insertReviewSchema } from "@/lib/validator";
import { InsertReview } from "@/types";
import { revalidatePath } from "next/cache";

export const createUpdateReview = async (data: InsertReview) => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not found");

    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id,
    });

    // Get the product Reviewed
    const product = await prisma.product.findFirst({
      where: {
        id: review.productId,
      },
    });

    if (!product) throw new Error("Product not found");

    // Check if the user has already reviewed the product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: review.productId,
      },
    });

    // Transaction to update the product with the average rating and the number of reviews
    await prisma.$transaction(async (tx) => {
      if (existingReview) {
        await tx.review.update({
          where: { id: existingReview.id },
          data: {
            rating: review.rating,
            title: review.title,
            description: review.description,
          },
        });
      } else {
        // Create a new review
        await tx.review.create({
          data: review,
        });
      }

      // Calculate the average rating and the number of reviews
      const averageRating = await tx.review.aggregate({
        where: { productId: review.productId },
        _avg: { rating: true },
      });

      // Calculate the number of reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      // Update the product with the average rating and the number of reviews
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating ?? 0,
          numReviews: numReviews,
        },
      });
    });

    revalidatePath(`/${ROUTES.PRODUCT}/${product.slug}`);

    return { success: true, message: "Review created successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

export const getAllReviews = async ({ productId }: { productId: string }) => {
  const data = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
};

export const getReviewFromUser = async ({
  productId,
}: {
  productId: string;
}) => {
  const session = await auth();

  if (!session) throw new Error("User is not Authenticated");

  return await prisma.review.findFirst({
    where: {
      productId,
      userId: session?.user?.id,
    },
  });
};
