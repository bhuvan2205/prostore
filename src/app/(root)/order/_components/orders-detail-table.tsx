"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { approvePayPalOrder, createPayPalOrder } from "@/actions/order";

type OrdersDetailTableProps = {
  order: Order;
  paypalClientId: string;
};

const OrdersDetailTable = (props: OrdersDetailTableProps) => {
  const { order, paypalClientId } = props || {};
  const {
    orderItems,
    shippingAddress,
    paymentInfo,
    subtotal,
    shippingCost,
    taxCost,
    total,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
    id: orderId,
  } = order || {};

  const { toast } = useToast();

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";
    if (isPending) {
      status = "Loading Paypal...";
    }
    if (isRejected) {
      status = "Failed to load PayPal";
    }
    return status;
  };

  const handleCreateOrder = async () => {
    const res = await createPayPalOrder(orderId);
    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
    }
    return res.data;
  };

  const handleApprove = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder({
      orderId,
      payPalOrderId: data.orderID,
    });

    toast({
      variant: res.success ? "default" : "destructive",
      description: res.message,
    });
  };

  return (
    <>
      <h1 className="py-4">Order {formatId(order?.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="pb-4 text-xl">Payment Method</h2>
              <p className="mb-2">{paymentInfo}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="mb-2">
            <CardContent className="p-4 gap-4">
              <h2 className="pb-4 text-xl">Shipping Address</h2>
              <p>{paymentInfo}</p>
              <p className="mb-2">
                {shippingAddress.fullName}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant="secondary">
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="pb-4 text-xl">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems?.map((item) => (
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
                <div>{formatCurrency(subtotal)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingCost)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(taxCost)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(total)}</div>
              </div>
              {!isPaid && paymentInfo === "PayPal" && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreateOrder}
                      onApprove={handleApprove}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrdersDetailTable;
