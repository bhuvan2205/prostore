import {
  lineItemSchema,
  insertCartSchema,
  insertProductSchema,
  shippingAddressSchema,
} from "@/lib/validator";
import { z } from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

export type LineItem = z.infer<typeof lineItemSchema>;
export type Cart = z.infer<typeof insertCartSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
