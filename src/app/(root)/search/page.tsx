import { getAllProducts } from "@/actions/admin";
import { getAllCategories } from "@/actions/products";
import ProductCard from "@/components/shared/product-list/product-card";
import { Button } from "@/components/ui/button";
import {
  PRICE_FILTERS,
  RATING_FILTERS,
  SORT_ORDERS,
} from "@/constants/products";
import Link from "next/link";
import React from "react";

type SearchProductPageProps = {
  searchParams: Promise<{
    query?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
};

export async function generateMetadata(props: SearchProductPageProps) {
  const {
    query = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props?.searchParams;

  const isQuerySet = query !== "all" && query.trim() !== "";
  const isCategorySet = category !== "all" && category.trim() !== "";
  const isPriceSet = price !== "all" && price.trim() !== "";
  const isRatingSet = rating !== "all" && rating.trim() !== "";

  if (isCategorySet || isPriceSet || isRatingSet || isQuerySet) {
    return {
      title: `Search ${isQuerySet ? `for "${query}"` : ""} ${
        isCategorySet ? `Category ${category}` : ""
      } ${isPriceSet ? `Price ${price}` : ""} ${
        isRatingSet ? `Rating ${rating}` : ""
      }`,
    };
  }

  return {
    title: "Search Products",
    description: "Search for products",
  };
}

const SearchProductPage = async (props: SearchProductPageProps) => {
  const {
    query = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "neweset",
    page = "1",
  } = await props?.searchParams;

  // Construct filter url
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    p?: string;
    r?: string;
    s?: string;
    pg?: string;
  }) => {
    const params = { query, category, price, rating, sort, page };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(
      params as Record<string, string>
    ).toString()}`;
  };

  const { products } = await getAllProducts({
    query,
    category,
    page: Number(page),
    price,
    sort,
    rating,
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Categor Links */}
        <div className="text-2xl mb-2 mt-3">Department</div>
        <div>
          <ul className="space-y-1">
            <li
              className={`${
                category === "all" || (category === "" && "font-bold")
              }`}
            >
              <Link href={getFilterUrl({ c: "all" })}>All</Link>
            </li>
            {categories.map((item) => (
              <li
                key={item?.category}
                className={`${item?.category === category ? "font-bold" : ""}`}
              >
                <Link href={getFilterUrl({ c: item?.category })}>
                  {item?.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Links */}
        <div className="text-2xl mb-2 mt-3">Price</div>
        <div>
          <ul className="space-y-1">
            <li
              className={`${price === "all" || (price === "" && "font-bold")}`}
            >
              <Link href={getFilterUrl({ p: "all" })}>Any</Link>
            </li>
            {PRICE_FILTERS.map((item) => (
              <li
                key={item?.value}
                className={`${item?.value === price ? "font-bold" : ""}`}
              >
                <Link href={getFilterUrl({ p: item?.value })}>
                  {item?.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Rating Links */}
        <div className="text-2xl mb-2 mt-3">Customer Rating</div>
        <div>
          <ul className="space-y-1">
            <li
              className={`${
                rating === "all" || (rating === "" && "font-bold")
              }`}
            >
              <Link href={getFilterUrl({ r: "all" })}>Any</Link>
            </li>
            {RATING_FILTERS.map((item) => (
              <li
                key={item?.value}
                className={`${item?.value === rating ? "font-bold" : ""}`}
              >
                <Link href={getFilterUrl({ r: item?.value })}>
                  {item?.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {query !== "all" && query !== "" && "Query: " + query}
            {category !== "all" && category !== "" && " Category: " + category}
            {price !== "all" && " Price: " + price}
            {rating !== "all" && " Rating: " + rating + " Star and above"}
            &nbsp;
            {(query !== "all" && query !== "") ||
            (category !== "all" && category !== "") ||
            price !== "all" ||
            rating !== "all" ? (
              <Button size="sm" asChild>
                <Link href="/search">Remove filters</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort by{" "}
            {SORT_ORDERS.map((order) => (
              <Link
                key={order}
                href={getFilterUrl({ s: order })}
                className={`mx-2 ${order === sort ? "font-bold" : ""}`}
              >
                {order}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.length === 0 && <div>No products found</div>}
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchProductPage;
