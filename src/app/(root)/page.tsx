import { getFeaturedProducts, getLatestProducts } from "@/actions/products";
import ProductCarousel from "@/components/shared/product-list/product-carousel";
import ProductList from "@/components/shared/product-list/product-list";
import ViewAllProducts from "@/components/shared/product-list/view-all-products";

export const metadata = {
  title: "Home",
};

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
    {!!featuredProducts?.length && <ProductCarousel products={featuredProducts} />}
      <ProductList data={latestProducts ?? []} title="New Arrivals" limit={4} />
      <ViewAllProducts />
    </>
  );
};

export default HomePage;
