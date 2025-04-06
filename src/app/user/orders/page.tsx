import { getMyOrders } from "@/actions/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PAGE_SIZE } from "@/constants/user";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import EmptyOrders from "./_components/empty-orders";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import Pagination from "@/components/shared/pagination";

export const metadata: Metadata = {
  title: "Customer Orders",
};

type OrdersPageProps = {
  searchParams: Promise<{ page: string }>;
};

const OrdersPage = async (props: OrdersPageProps) => {
  const { page } = await props.searchParams;
  const orders = await getMyOrders({
    limit: PAGE_SIZE,
    page: Number(page) || 1,
  });
  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Orders</h2>
      {orders?.data?.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>PAID</TableHead>
                <TableHead>DELIVERED</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.data?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{formatId(order.id)}</TableCell>
                  <TableCell>
                    {formatDateTime(order.createdAt).dateTime}
                  </TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    {order.isPaid && order.paidAt
                      ? formatDateTime(order.paidAt).dateTime
                      : "Not Paid"}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered && order.deliveredAt
                      ? formatDateTime(order.deliveredAt).dateTime
                      : "Not Delivered"}
                  </TableCell>
                  <TableCell>
                    <Link href={`${ROUTES.ORDER}/${order.id}`}>
                      <span className="px-2">Details</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            page={Number(page) || 1}
            totalPages={orders?.totalPages}
          />
        </div>
      ) : (
        <EmptyOrders />
      )}
    </div>
  );
};

export default OrdersPage;
