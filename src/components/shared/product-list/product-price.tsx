import { cn } from "@/lib/utils";
import React from "react";

type ProductPriceProps = {
  amount: number;
  className?: string;
};

const ProductPrice = (props: ProductPriceProps) => {
  const { amount, className } = props || {};

  const stringValue = amount.toString();
  const [intValue, floatValue] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
};

export default ProductPrice;
