import { getMyCart } from "@/actions/cart";
import CartTable from "./_components/cart-table";

const CartPage = async () => {
  const cart = await getMyCart();
  return <CartTable cart={cart} />;
};

export default CartPage;
