import { Metadata } from "next";
import ProductForm from "../../_components/product-form";

export const metadata: Metadata = {
  title: "Create Product",
};

const CreateProductPage = () => {
  return (
    <>
      <h2 className="bold">Create product</h2>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </>
  );
};

export default CreateProductPage;
