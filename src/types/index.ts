import {
  lineItemSchema,
  insertCartSchema,
  insertProductSchema,
  shippingAddressSchema,
  paymentMethodSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
  updateUserSchema,
  insertReviewSchema,
  insertReviewFormSchema,
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
export type PaymentResult = z.infer<typeof paymentResultSchema>;
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
export type SalesData = { month: string; totalSales: number };
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type InsertReviewForm = z.infer<typeof insertReviewFormSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
  };
};
