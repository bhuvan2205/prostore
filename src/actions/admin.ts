"use server";

import { prisma } from "@/config/db";
import { ROUTES } from "@/constants/routes";
import { PAGE_SIZE } from "@/constants/user";
import { formatErrors } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { updateOrderToPaid } from "./order";

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

export const updateOrderToPaidCOD = async (orderId: string) => {
  try {
    await updateOrderToPaid({ orderId });

    revalidatePath(`/order/${orderId}`);
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

    revalidatePath(`/order/${orderId}`);
    return { success: true, message: "Order delivered Successfully" };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};
