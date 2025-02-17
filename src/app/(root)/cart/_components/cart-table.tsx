"use client";

import { addItemToCart, removeItemFromCart } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Cart } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

type CartTableProps = {
  cart?: Cart;
};

const CartTable = (props: CartTableProps) => {
  const { cart } = props || {};
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="h2-bold py-4">Shopping Cart</h1>

      {!cart || cart.lineItems.length === 0 ? (
        <div>
          Cart is empty <Link href={ROUTES.HOME}>Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:grid-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.lineItems.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => {
                          startTransition(async () => {
                            const res = await removeItemFromCart(
                              item.productId
                            );
                            if (!res.success) {
                              toast({
                                description: res.message,
                                variant: "destructive",
                              });
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader className="animate-spin w-4 h-4" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="px-2">{item.quantity}</span>
                      <Button
                        disabled={isPending}
                        variant="outline"
                        type="button"
                        onClick={() => {
                          startTransition(async () => {
                            const res = await addItemToCart(item);
                            if (!res.success) {
                              toast({
                                description: res.message,
                                variant: "destructive",
                              });
                            }
                          });
                        }}
                      >
                        {isPending ? (
                          <Loader className="animate-spin w-4 h-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Subtotal (
                {cart.lineItems.reduce((acc, item) => acc + item.quantity, 0)}):
                <span className="font-bold">
                  {formatCurrency(cart.subtotal)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
