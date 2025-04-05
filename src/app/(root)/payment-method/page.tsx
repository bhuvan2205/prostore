import { getUserById } from "@/actions/user";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { auth } from "@/config/auth";
import { Metadata } from "next";
import PaymentMethodForm from "./_components/payment-method-form";

export const metadata: Metadata = {
  title: "Select Payment Method",
};

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user?.paymentInfo} />
    </>
  );
};

export default PaymentMethodPage;
