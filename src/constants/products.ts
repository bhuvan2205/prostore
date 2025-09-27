import { getRandomBannerImage, getRandomImageArray } from "@/lib/products";

export const LATEST_PRODUCTS_LIMIT = 4;
export const TAX_PERCENTAGE = 0.15;
export const SHIPPING_COST = 50;
export const ELIGIBLE_FOR_FREE_SHIPPING = 100;

export const CREATE_PRODUCT_DEFAULT_VALUES = {
  name: "",
  slug: "",
  category: "",
  images: getRandomImageArray(),
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: 0,
  isFeatured: false,
  banner: getRandomBannerImage(),
};

export const PRICE_FILTERS = [
  {
    label: "$0 - $50",
    value: "0-50",
  },
  {
    label: "$51 - $100",
    value: "51-100",
  },
  {
    label: "$101 - $200",
    value: "101-200",
  },
  {
    label: "$201 - $500",
    value: "201-500",
  },
  {
    label: "$501 - $1000",
    value: "501-1000",
  },
];

export const RATING_FILTERS = [
  {
    label: "1 Star and above",
    value: "1",
  },
  {
    label: "2 Stars and above",
    value: "2",
  },
  {
    label: "3 Stars and above",
    value: "3",
  },
  {
    label: "4 Stars and above",
    value: "4",
  },
];

export const SORT_ORDERS = ["newest", "lowest", "highest", "rating"];
