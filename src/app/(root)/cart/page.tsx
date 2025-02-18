import React from "react";
import CartTable from "./_components/cart-table";
import { getMyCart } from "@/actions/cart";

const CartPage = async () => {
  const cart = await getMyCart();
  return <CartTable cart={cart} />;
};

export default CartPage;
