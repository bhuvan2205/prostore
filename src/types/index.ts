import {
  lineItemSchema,
  insertCartSchema,
  insertProductSchema,
  shippingAddressSchema,
  paymentMethodSchema,
  insertOrderItemSchema,
  insertOrderSchema,
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
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt: Date | null;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: {
    name: string;
    email: string | null;
  };
};
