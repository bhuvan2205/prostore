import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import UserMenu from "@/components/shared/header/user-menu";
import MainNav from "./_components/main-nav";
import { Input } from "@/components/ui/input";

type RootLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="flex flex-col">
      <div className="border-b container mx-auto">
        <div className="flex items-center h-16 px-4">
          <Link href={ROUTES.HOME} className="w-22">
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={48}
              height={48}
              priority
            />
          </Link>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <div>
              <Input
                type="search"
                placeholder="Search..."
                className="md:w-[100px] lg:w-[300px]"
              />
            </div>
            <UserMenu />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
