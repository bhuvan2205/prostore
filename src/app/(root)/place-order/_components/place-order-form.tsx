"use client";

import { useRouter } from "next/navigation";
import PlaceOrderButton from "./place-order-button";
import { FormEvent } from "react";
import { createOrder } from "@/actions/order";

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
