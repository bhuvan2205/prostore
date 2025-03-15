"use server";

import { auth } from "@/config/auth";
import { prisma } from "@/config/db";
import { formatErrors } from "@/lib/utils";
import { paymentMethodSchema } from "@/lib/validator";
import { z } from "zod";

export const updateUserPaymentMethod = async (
  data: z.infer<typeof paymentMethodSchema>
) => {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error("User not found");

    const paymentInfo = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        paymentInfo: paymentInfo.type,
      },
    });

    return {
      success: true,
      message: "Payment method updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatErrors(error),
    };
  }
};
