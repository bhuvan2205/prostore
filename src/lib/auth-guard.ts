import { auth } from "@/config/auth";
import { USER_ROLES } from "@/constants/user";
import { redirect } from "next/navigation";

export const requireAdmin = async () => {
  const session = await auth();
  if (session?.user?.role !== USER_ROLES.ADMIN) {
    redirect("/unauthorized");
  }
  return session;
};
