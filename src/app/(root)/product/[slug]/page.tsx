import { getMyCart } from "@/actions/cart";
import { getSingleProductBySlug } from "@/actions/products";
import AddToCart from "@/components/shared/product-list/add-to-cart";
import ProductImages from "@/components/shared/product-list/product-images";
import ProductPrice from "@/components/shared/product-list/product-price";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/config/auth";
import { notFound } from "next/navigation";
import ReviewList from "../_components/review-list";

type ProductDetailPage = {
  params: Promise<{ slug: string }>;
};

const ProductDetailPage = async (props: ProductDetailPage) => {
  const { slug } = await props.params;
  const product = await getSingleProductBySlug(slug);

  if (!product) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const cart = await getMyCart();

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>
                {product.rating} of {product.numReviews} reviews
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <ProductPrice
                  amount={Number(product.price)}
                  className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                />
              </div>
            </div>
            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className="p-4">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div>
                    <ProductPrice amount={Number(product.price)} />
                  </div>
                </div>
                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product?.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out Of Stock</Badge>
                  )}
                </div>
                {product?.stock > 0 && (
                  <div className="flex-center">
                    <AddToCart
                      cart={cart}
                      lineItem={{
                        productId: product.id,
                        slug: product.slug,
                        name: product.name,
                        quantity: 1,
                        price: product.price,
                        image: product.images[0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold mb-2">Customer Reviews</h2>
        <ReviewList
          userId={userId}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </>
  );
};

export default ProductDetailPage;
