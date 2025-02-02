import { LineItem } from "@/types";
import { roundTwoDigit } from "./utils";
import {
  ELIGIBLE_FOR_FREE_SHIPPING,
  SHIPPING_COST,
  TAX_PERCENTAGE,
} from "@/constants/products";

export const calcPrice = (lineItems: LineItem[]) => {
  const subtotal = roundTwoDigit(
      lineItems.reduce(
        (acc, item) => acc + Number(item.price) * item.quantity,
        0
      )
    ),
    shippingCost = roundTwoDigit(
      subtotal > ELIGIBLE_FOR_FREE_SHIPPING ? 0 : SHIPPING_COST
    ),
    taxCost = roundTwoDigit(subtotal * TAX_PERCENTAGE),
    total = roundTwoDigit(subtotal + shippingCost + taxCost);

  return {
    subtotal: subtotal.toFixed(2),
    shippingCost: shippingCost.toFixed(2),
    taxCost: taxCost.toFixed(2),
    total: total.toFixed(2),
  };
};
