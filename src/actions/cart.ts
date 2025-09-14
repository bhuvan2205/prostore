"use server";

import { auth } from "@/config/auth";
import { prisma } from "@/config/db";
import { SESSION_CART_ID } from "@/constants/cart";
import { ROUTES } from "@/constants/routes";
import { calcPrice } from "@/lib/cart";
import { convertToPlainObject, formatErrors } from "@/lib/utils";
import { insertCartSchema, lineItemSchema } from "@/lib/validator";
import { LineItem } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const addItemToCart = async (data: LineItem) => {
  try {
    const sessionCartId = (await cookies()).get(SESSION_CART_ID)?.value;

    if (!sessionCartId) {
      throw new Error("No cart found");
    }

    const session = await auth();

    const userId = session?.user?.id
      ? (session?.user?.id as string)
      : undefined;

    const cart = await getMyCart();

    const lineItem = lineItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: { id: lineItem.productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId,
        lineItems: [lineItem],
        sessionCartId,
        ...calcPrice([lineItem]),
      });

      await prisma.cart.create({
        data: newCart,
      });
    } else {
      const existingLineItem = cart.lineItems.find(
        (item) => item.productId === lineItem.productId
      );

      if (existingLineItem) {
        if (product.stock < existingLineItem.quantity + 1) {
          throw new Error("Not enough stock");
        }

        cart.lineItems.find(
          (item) => item.productId === lineItem.productId
        )!.quantity = existingLineItem.quantity + 1;
      } else {
        if (product.stock < 1) {
          throw new Error("Not enough stock");
        }
        cart.lineItems.push(lineItem);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          lineItems: cart.lineItems,
          ...calcPrice(cart.lineItems),
        },
      });
    }

    revalidatePath(`/${ROUTES.PRODUCT}/${product.slug}`);

    return { success: true, message: `${product.name} added to cart` };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

export const removeItemFromCart = async (productId: string) => {
  try {
    const sessionCartId = (await cookies()).get(SESSION_CART_ID)?.value;
    if (!sessionCartId) {
      throw new Error("No cart found");
    }

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) {
      throw new Error("Product not found");
    }

    const cart = await getMyCart();
    if (!cart) {
      throw new Error("Cart not found");
    }

    const existingLineItem = cart.lineItems.find(
      (item) => item.productId === productId
    );
    if (!existingLineItem) {
      throw new Error("Item not found in cart");
    }

    if (existingLineItem.quantity === 1) {
      cart.lineItems = cart.lineItems.filter(
        (item) => item.productId !== productId
      );
    } else {
      cart.lineItems.find((item) => item.productId === productId)!.quantity =
        existingLineItem.quantity - 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        lineItems: cart.lineItems,
        ...calcPrice(cart.lineItems),
      },
    });

    revalidatePath(`/${ROUTES.PRODUCT}/${product.slug}`);

    return { success: true, message: `${product.name} removed from the cart` };
  } catch (error) {
    return { success: false, message: formatErrors(error) };
  }
};

export const getMyCart = async () => {
  const sessionCartId = (await cookies()).get(SESSION_CART_ID)?.value;

  if (!sessionCartId) {
    throw new Error("No cart found");
  }

  const session = await auth();
  const userId = session?.user?.id ? (session?.user?.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    lineItems: cart.lineItems as LineItem[],
    subtotal: cart.subtotal.toString(),
    shippingCost: cart.shippingCost.toString(),
    taxCost: cart.taxCost.toString(),
    total: cart.total.toString(),
  });
};
