import { ROUTES } from "@/constants/routes";

export const getAdminFormActionUrl = (pathname: string): string => {
  if (pathname.includes(ROUTES.ADMIN_ORDERS)) {
    return ROUTES.ADMIN_ORDERS;
  }
  if (pathname.includes(ROUTES.ADMIN_PRODUCTS)) {
    return ROUTES.ADMIN_PRODUCTS;
  }
  return ROUTES.ADMIN_USERS;
};
