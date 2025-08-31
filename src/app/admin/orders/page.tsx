import { deleteOrder, getAllOrders } from "@/actions/admin";
import EmptyOrders from "@/app/user/orders/_components/empty-orders";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Orders",
};

type AdminOrdersPageProps = {
  searchParams: Promise<{ page: string }>;
};

const AdminOrdersPage = async (props: AdminOrdersPageProps) => {
  const { page = "1" } = await props.searchParams;

  const { orders, totalPages } = await getAllOrders({
    page: Number(page),
  });
  return (
    <>
      <div className="space-y-2">
        <h2 className="h2-bold">Orders</h2>
        {orders?.length > 0 ? (
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
                {orders?.map((order) => (
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
                      <Button asChild variant="outline" size="sm">
                        <Link href={`${ROUTES.ORDER}/${order.id}`}>
                          Details
                        </Link>
                      </Button>
                      <DeleteDialog id={order.id} action={deleteOrder} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <Pagination page={Number(page) || 1} totalPages={totalPages} />
            )}
          </div>
        ) : (
          <EmptyOrders />
        )}
      </div>
    </>
  );
};

export default AdminOrdersPage;
