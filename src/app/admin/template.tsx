import { requireAdmin } from "@/lib/auth-guard";
import { ReactNode } from "react";

const AdminTemplate = async ({ children }: { children: ReactNode }) => {
  await requireAdmin();

  return <>{children}</>;
};

export default AdminTemplate;
