"use server";

import { auth } from "@/config/auth";
import { convertToPlainObject, formatErrors } from "@/lib/utils";
import { getMyCart } from "./cart";
import { getUserById } from "./user";
import { ROUTES } from "@/constants/routes";
import { insertOrderSchema } from "@/lib/validator";
import { prisma } from "@/config/db";
import { paypal } from "@/lib/paypal";
import { PaymentResult } from "@/types";
import { revalidatePath } from "next/cache";

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
    return { success: false, message: formatErrors(error) };
  }
};

export const getOrderById = async (id: string) => {
  const data = await prisma.order.findFirst({
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

export const createPayPalOrder = async (orderId: string) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found");

    const paypalOrder = await paypal.createOrder(Number(order.total));

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          pricePaid: 0,
          status: "",
          email_address: "",
        },
      },
    });

    return {
      success: true,
      message: "Item order created successfully",
      data: paypalOrder.id,
    };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

export const approvePayPalOrder = async (payload: {
  orderId: string;
  payPalOrderId: string;
}) => {
  const { orderId, payPalOrderId } = payload || {};

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) throw new Error("Order not found");

    const capturePayment = await paypal.capturePayment(payPalOrderId);

    if (
      !capturePayment ||
      capturePayment.id !== (order.paymentResult as PaymentResult)?.id ||
      capturePayment.status !== "COMPLETED"
    ) {
      throw new Error("Error in Paypal payment");
    }

    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: capturePayment.id,
        status: capturePayment.status,
        email_address: capturePayment.payer?.email_address,
        pricePaid: capturePayment.purchase_units
          ?.at(0)
          ?.payments?.captures?.at(0)?.amount?.value,
      },
    });

    revalidatePath(`/${ROUTES.ORDER}/${orderId}`);

    return {
      success: true,
      message: "Your order has been paid",
    };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

const updateOrderToPaid = async (payload: {
  orderId: string;
  paymentResult?: PaymentResult;
}) => {
  const { orderId, paymentResult } = payload || {};

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
    },
  });

  if (!order) throw new Error("Order not found");

  if (order.isPaid) throw new Error("Order is already paid");

  await prisma.$transaction(async (tx) => {
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: -item.quantity,
          },
        },
      });
    }

    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!updatedOrder) throw new Error("Order not found");
};
