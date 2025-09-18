import { APP_NAME } from "@/constants/pages";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./user-menu";
import CategoryDrawer from "./category-drawer";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={48}
              height={48}
              priority
            />
            <span className="text-2xl font-bold ml-3 hidden lg:block">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
