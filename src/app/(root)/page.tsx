import { getLatestProducts } from "@/actions/products";
import ProductList from "@/components/shared/product-list/product-list";

export const metadata = {
  title: "Home",
};

const HomePage = async () => {
  const latestProducts = await getLatestProducts();
  return (
    <>
      <ProductList data={latestProducts} title="New Arrivals" limit={4} />
    </>
  );
};

export default HomePage;
