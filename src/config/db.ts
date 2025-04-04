import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";
import { getEnv } from "./get-env";

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = getEnv("DATABASE_URL");

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString });

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon(pool);

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      subtotal: {
        needs: { subtotal: true },
        compute(cart) {
          return cart.subtotal.toString();
        },
      },
      total: {
        needs: { total: true },
        compute(cart) {
          return cart.total.toString();
        },
      },
      shippingCost: {
        needs: { shippingCost: true },
        compute(cart) {
          return cart.shippingCost.toString();
        },
      },
      taxCost: {
        needs: { taxCost: true },
        compute(cart) {
          return cart.taxCost.toString();
        },
      },
    },
    order: {
      subtotal: {
        needs: { subtotal: true },
        compute(cart) {
          return cart.subtotal.toString();
        },
      },
      total: {
        needs: { total: true },
        compute(cart) {
          return cart.total.toString();
        },
      },
      shippingCost: {
        needs: { shippingCost: true },
        compute(cart) {
          return cart.shippingCost.toString();
        },
      },
      taxCost: {
        needs: { taxCost: true },
        compute(cart) {
          return cart.taxCost.toString();
        },
      },
    },
    orderItem: {
      price: {
        compute(orderItem) {
          return orderItem.price.toString();
        },
      },
    },
  },
});
