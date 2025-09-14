import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "@/constants/payments";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places"
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Id is required"),
});

export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 8 characters"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const lineItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  quantity: z.number().int().nonnegative("Quantity must be a positive integer"),
  price: currency,
  image: z.string().min(1, "Image is required"),
});

export const insertCartSchema = z.object({
  lineItems: z.array(lineItemSchema),
  subtotal: currency,
  shippingCost: currency,
  taxCost: currency,
  total: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be atleast 3 characters"),
  streetAddress: z.string().min(3, "Address must be atleast 3 characters"),
  city: z.string().min(3, "City must be atleast 3 characters"),
  postalCode: z.string().min(3, "Postal code must be atleast 3 characters"),
  country: z.string().min(3, "Country must be atleast 3 characters"),
  lat: z.number().optional(),
  lon: z.number().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  subtotal: currency,
  shippingCost: currency,
  taxCost: currency,
  total: currency,
  paymentInfo: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
    path: ["paymentInfo"],
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  slug: z.string(),
  quantity: z.number().int().nonnegative("Quantity must be a positive integer"),
  price: currency,
  image: z.string(),
  name: z.string(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().min(3, "Email must be at least 3 characters"),
});

export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "Id is required"),
  role: z.string().min(1, "Role is required"),
});
