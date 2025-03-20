"use server";

import { auth } from "@/config/auth";
import { convertToPlainObject, formatErrors } from "@/lib/utils";
import { getMyCart } from "./cart";
import { getUserById } from "./user";
import { ROUTES } from "@/constants/routes";
import { insertOrderSchema } from "@/lib/validator";
import { prisma } from "@/config/db";

export const createOrder = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User not found");

    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const cart = await getMyCart();

    if (!cart || !cart.lineItems.length) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: ROUTES.CART,
      };
    }

    const user = await getUserById(userId);
    const { shippingAddress, paymentInfo } = user || {};

    if (!shippingAddress) {
      return {
        success: false,
        message: "Please add a shipping address",
        redirectTo: ROUTES.SHIPPING_ADDRESS,
      };
    }

    if (!paymentInfo) {
      return {
        success: false,
        message: "Please add a payment method",
        redirectTo: ROUTES.PAYMENT_METHOD,
      };
    }

    const order = insertOrderSchema.parse({
      ...cart,
      shippingAddress,
      paymentInfo,
    });

    const createdOrderId = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: order,
      });

      for (const lineItem of cart.lineItems) {
        await tx.orderItem.create({
          data: {
            ...lineItem,
            orderId: createdOrder.id,
          },
        });
      }

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          lineItems: [],
          subtotal: 0,
          total: 0,
          taxCost: 0,
          shippingCost: 0,
        },
      });

      return createdOrder.id;
    });

    if (!createdOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `${ROUTES.ORDER}/${createdOrderId}`,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: formatErrors(error) };
  }
};

export const getOrderById = async (id: string) => {
 const data =  await prisma.order.findFirst({
    where: {
      id,
    },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
};
