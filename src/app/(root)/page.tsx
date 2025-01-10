import ProductList from "@/components/shared/product-list/product-list";
import sampleData from "@/data/sample-data";

export const metadata = {
  title: "Home",
};

const HomePage = async () => {
  return (
    <>
      <ProductList data={sampleData?.products} title="New Arrivals" limit={4} />
    </>
  );
};

export default HomePage;
