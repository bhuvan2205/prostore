import { getOrderById } from "@/actions/order";
import { getEnv } from "@/config/get-env";
import { ShippingAddress } from "@/types";
import { notFound } from "next/navigation";
import OrdersDetailTable from "../_components/orders-detail-table";
import { auth } from "@/config/auth";

type OrderDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const OrderDetailsPage = async (props: OrderDetailsPageProps) => {
  const { id } = await props.params;
  const order = await getOrderById(id);
  if (!order) notFound();
  const session = await auth();

  return (
    <div>
      <OrdersDetailTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        paypalClientId={getEnv("PAYPAL_CLIENT_ID")}
        isAdmin={session?.user?.role === "admin"}
      />
    </div>
  );
};
export default OrderDetailsPage;
