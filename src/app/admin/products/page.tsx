import { deleteProduct, getAllProducts } from "@/actions/admin";
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
import { formatCurrency, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Products",
};

type AdminProductPageProps = {
  searchParams: Promise<{ page: string; query: string; category: string }>;
};

const AdminProductPage = async (props: AdminProductPageProps) => {
  const searchParams = await props?.searchParams;
  const { page = "1", query, category } = searchParams || {};

  const { products, totalPages } = await getAllProducts({
    query,
    page: Number(page),
    category,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATINGS</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product?.id}>
              <TableCell>{formatId(product?.id)}</TableCell>
              <TableCell>{product?.name}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>{product?.category}</TableCell>
              <TableCell>{product?.stock}</TableCell>
              <TableCell>{product?.rating}</TableCell>
              <TableCell className="flex gap-1">
                <Button asChild variant="outline">
                  <Link href={`/admin/products/${product?.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={product?.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Pagination page={Number(page) || 1} totalPages={totalPages} />
      )}
    </div>
  );
};

export default AdminProductPage;
