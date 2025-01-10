import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";

type ProductCardProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
};

const ProductCard = (props: ProductCardProps) => {
  const { product } = props || {};
  return (
    <Card>
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${product?.slug}`}>
          <Image
            src={product?.images?.at(0)}
            alt={product?.name}
            priority
            width={300}
            height={300}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/product/${product?.slug}`}>
          <h2 className="text-sm font-medium">{product.medium}</h2>
        </Link>
        <div className="flex-between gap-4">
          <p>{product.rating} Stars</p>
          {product.stock > 0 ? (
            <ProductPrice amount={Number(product.price)} />
          ) : (
            <p className="text-destructive">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
