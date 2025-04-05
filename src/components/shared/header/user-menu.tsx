import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import {
  EllipsisVertical,
  ShoppingCart,
  ShoppingCartIcon,
} from "lucide-react";
import UserButton from "./user-button";

const UserMenu = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden w-full max-w-sm gap-1 md:flex">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href={ROUTES.CART}>
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant="ghost">
              <Link href={ROUTES.CART}>
                <ShoppingCartIcon /> Cart
              </Link>
            </Button>
            <UserButton />
            <SheetDescription />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default UserMenu;
