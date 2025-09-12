import { getSingleProductById } from "@/actions/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductForm from "../../_components/product-form";

export const metadata: Metadata = {
  title: "Update Product",
};

type AdminProductUpdatePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const AdminProductUpdatePage = async (props: AdminProductUpdatePageProps) => {
  const { id } = (await props?.params) || {};
  const product = await getSingleProductById(id);
  if (!product) return notFound();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1>Update Product</h1>
      <ProductForm type="Update" product={product} productId={product?.id} />
    </div>
  );
};

export default AdminProductUpdatePage;
