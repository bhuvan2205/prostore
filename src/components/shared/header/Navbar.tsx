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
  User,
} from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden w-full max-w-sm gap-1 md:flex">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href={ROUTES.CART}>
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href={ROUTES.LOGIN}>
            <User /> Login
          </Link>
        </Button>
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
            <Button asChild>
              <Link href={ROUTES.LOGIN}>
                <User /> Login
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Navbar;
