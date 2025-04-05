import { getOrderById } from "@/actions/order";
import { notFound } from "next/navigation";
import OrdersDetailTable from "../_components/orders-detail-table";
import { ShippingAddress } from "@/types";
import { getEnv } from "@/config/get-env";

type OrderDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const OrderDetailsPage = async (props: OrderDetailsPageProps) => {
  const { id } = await props.params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <div>
      <OrdersDetailTable
        order={{...order, shippingAddress: order.shippingAddress as ShippingAddress}}
        paypalClientId={getEnv("PAYPAL_CLIENT_ID")}
      />
    </div>
  );
};
export default OrderDetailsPage;
