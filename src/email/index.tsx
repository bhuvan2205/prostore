import { getEnv } from "@/config/get-env";
import { Order } from "@/types";
import { Resend } from "resend";
import PurchaseReceiptEmail from "./purchase-email";

const resend = new Resend(getEnv("RESEND_API_KEY"));

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: "Prostore onboarding@resend.dev",
    to: order.user.email as string,
    subject: "Purchase Receipt for Order #${order.id}",
    react: <PurchaseReceiptEmail order={order} />,
  });
};
