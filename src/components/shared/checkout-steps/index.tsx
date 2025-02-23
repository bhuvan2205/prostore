import { CHECKOUT_PAGES } from "@/constants/checkout-steps";
import { cn } from "@/lib/utils";
import React, { Fragment } from "react";

type CheckoutStepsProps = {
  current: number;
};

const CheckoutSteps = (props: CheckoutStepsProps) => {
  const { current = 0 } = props || {};
  return (
    <div className='flex flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10'>
      {CHECKOUT_PAGES.map((step, index) => (
        <Fragment key={step}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-sm text-center",
              index === current ? "bg-secondary" : ""
            )}
          >
            {step}
          </div>
          {step !== "Place Order" && (
            <hr className='w-16 border-t mx-2 border-gray-300' />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
