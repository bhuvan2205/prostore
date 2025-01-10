/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ProductCard from "./product-card";

type ProductListProps = {
  data: any;
  title?: string;
  limit?: number;
};

const ProductList = (props: ProductListProps) => {
  const { data, title, limit } = props || {};

  const limitData = limit ? data?.slice(0, limit) : data;
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {limitData?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {limitData?.map((product: any) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>No Products found</div>
      )}
    </div>
  );
};

export default ProductList;
