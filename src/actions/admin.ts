"use server";

import { prisma } from "@/config/db";
import { ROUTES } from "@/constants/routes";
import { PAGE_SIZE } from "@/constants/user";
import { formatErrors } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { updateOrderToPaid } from "./order";
import { insertProductSchema, updateProductSchema } from "@/lib/validator";
import { z } from "zod";
import { UpdateUser } from "@/types";
import { Prisma } from "@prisma/client";
import { getProductSortOrder } from "@/lib/products";

export const getAllOrders = async ({
  limit = PAGE_SIZE,
  page = 1,
  query,
}: {
  limit?: number;
  page?: number;
  query: string;
}) => {
  // Query Filter
  const queryFilter: Prisma.OrderWhereInput =
    query && query !== "all"
      ? {
          user: {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        }
      : {};

  const orders = await prisma.order.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
    where: {
      ...queryFilter,
    },
  });

  const ordersCount = await prisma.order.count();

  return {
    orders,
    totalPages: Math.ceil(ordersCount / limit),
  };
};

export const deleteOrder = async (orderId: string) => {
  try {
    const existingOrder = await prisma.order.findFirst({
      where: { id: orderId },
    });
    if (!existingOrder) throw new Error("Order not found");

    await prisma.order.delete({ where: { id: orderId } });

    revalidatePath(ROUTES.ADMIN_ORDERS);

    return { success: true, message: "Order deleted Successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

export const updateOrderToPaidCOD = async (orderId: string) => {
  try {
    await updateOrderToPaid({ orderId });

    revalidatePath(`/${ROUTES.ORDER}/${orderId}`);
    return { success: true, message: "Order paid Successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

export const deliverOrder = async (orderId: string) => {
  try {
    const order = await prisma.order.findFirst({ where: { id: orderId } });
    if (!order) throw new Error("No order found!");
    if (!order.isPaid) throw new Error("Order is not Paid!");

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/${ROUTES.ORDER}/${orderId}`);
    return { success: true, message: "Order delivered Successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

export const getAllProducts = async ({
  limit = PAGE_SIZE,
  page = 1,
  category,
  query,
  price,
  rating,
  sort,
}: {
  limit?: number;
  page?: number;
  query?: string;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) => {
  // Query Filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter = category && category !== "all" ? { category } : {};

  // Price filter
  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  // Rating filter
  const ratingFilter =
    rating && rating !== "all" ? { rating: { gte: Number(rating) } } : {};

  const products = await prisma.product.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: getProductSortOrder(sort),
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
  });

  const productsCount = await prisma.product.count();

  return {
    products,
    totalPages: Math.ceil(productsCount / limit),
  };
};

export const deleteProduct = async (productId: string) => {
  try {
    const existingProduct = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!existingProduct) throw new Error("Product not found");

    await prisma.product.delete({ where: { id: productId } });

    revalidatePath(ROUTES.ADMIN_PRODUCTS);
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

export const createProduct = async (
  data: z.infer<typeof insertProductSchema>
) => {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath(ROUTES.ADMIN_PRODUCTS);
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

export const updateProduct = async (
  data: z.infer<typeof updateProductSchema>
) => {
  try {
    const product = updateProductSchema.parse(data);
    const existingProduct = await prisma.product.findFirst({
      where: { id: product.id },
    });
    if (!existingProduct) throw new Error("Product not found");

    await prisma.product.update({ where: { id: product.id }, data: product });

    revalidatePath(ROUTES.ADMIN_PRODUCTS);
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

export const getAllUsers = async ({
  limit = PAGE_SIZE,
  page = 1,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) => {
  // Query Filter
  const queryFilter: Prisma.UserWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  const users = await prisma.user.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    where: { ...queryFilter },
  });

  const userCount = await prisma.user.count();

  return { userCount, users, totalPages: Math.ceil(userCount / limit) };
};

export const deleteUser = async (userId: string) => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!existingUser) throw new Error("User not found");

    await prisma.user.delete({ where: { id: userId } });

    revalidatePath(ROUTES.ADMIN_USERS);

    return { success: true, message: "User deleted Successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

export async function updateUser(user: UpdateUser) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath(ROUTES.ADMIN_USERS);

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
}
