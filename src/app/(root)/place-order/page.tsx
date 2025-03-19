import { getMyCart } from "@/actions/cart";
import { getUserById } from "@/actions/user";
import CheckoutSteps from "@/components/shared/checkout-steps";
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
import { auth } from "@/config/auth";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import PlaceOrderForm from "./_components/place-order-form";

export const metadata = {
  title: "Place Order",
};

const PlaceOrderPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);
  if (!user.shippingAddress) redirect(ROUTES.SHIPPING_ADDRESS);
  if (!user.paymentInfo) redirect(ROUTES.PAYMENT_METHOD);

  const cart = await getMyCart();
  if (!cart || !cart.lineItems.length) redirect(ROUTES.CART);

  const shippingAddress = user.shippingAddress as ShippingAddress;
  const paymentInfo = user.paymentInfo;

  return (
    <>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">Place Order</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="space-y-4 overflow-x-auto md:col-span-2">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              <div className="mt-3">
                <Link href={ROUTES.SHIPPING_ADDRESS}>
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{paymentInfo}</p>
              <div className="mt-3">
                <Link href={ROUTES.PAYMENT_METHOD}>
                  <Button variant="outline">Edit</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.lineItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={100}
                            height={100}
                          />
                          <span>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.quantity}</span>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.price}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Subtotal</div>
                <div>{formatCurrency(cart.subtotal)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(cart.shippingCost)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(cart.taxCost)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(cart.total)}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
