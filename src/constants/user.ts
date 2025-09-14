import { ROUTES } from "./routes";

export const HASH_SALT_ROUNDS = 8;
export const PAGE_SIZE = 12;
export const TRIGGER_EVENTS = {
  SIGN_IN: "signIn",
  SIGN_UP: "signUp",
  UPDATE: "update",
};

export const PROTECTED_ROUTES = [
  /\/shipping-address/,
  /\/payment-method/,
  /\/place-order/,
  /\/profile/,
  /\/user\/(.*)/,
  /\/order\/(.*)/,
  /\/admin/,
];

export const USER_NAVLINKS = [
  {
    title: "Profile",
    href: ROUTES.PROFILE,
  },
  {
    title: "Orders",
    href: ROUTES.LIST_ORDER,
  },
];

export const ADMIN_NAVLINKS = [
  {
    title: "Overview",
    href: ROUTES.ADMIN_OVERVIEW,
  },
  {
    title: "Products",
    href: ROUTES.ADMIN_PRODUCTS,
  },
  {
    title: "Orders",
    href: ROUTES.ADMIN_ORDERS,
  },
  {
    title: "Users",
    href: ROUTES.ADMIN_USERS,
  },
];

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};
