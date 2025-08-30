"use server";

import { prisma } from "@/config/db";
import { ROUTES } from "@/constants/routes";
import { PAGE_SIZE } from "@/constants/user";
import { formatErrors } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const getAllOrders = async ({ limit = PAGE_SIZE, page = 1 }) => {
  const orders = await prisma.order.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const ordersCount = await prisma.order.count();

  return {
    orders,
    totalPages: Math.ceil(ordersCount / limit),
  };
};

export const deleteOrder = async (id: string) => {
  try {
    await prisma.order.delete({ where: { id } });

    revalidatePath(ROUTES.ADMIN_ORDERS);

    return { success: false, message: "Order deleted Successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};
