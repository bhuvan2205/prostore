import { getMyCart } from "@/actions/cart";
import { getUserById } from "@/actions/user";
import { auth } from "@/config/auth";
import { ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";
import ShippingAddressForm from "./_components/shippingAddress-form";
import { ShippingAddress } from "@/types";

export const metadata = {
  title: "Shipping Address",
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.lineItems.length === 0) {
    redirect(ROUTES.CART);
  }

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("No User Id");
  }

  const user = await getUserById(userId);

  return (
    <>
      <ShippingAddressForm address={user?.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
