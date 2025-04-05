import { signOutUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/config/auth";
import { ROUTES } from "@/constants/routes";
import { User } from "lucide-react";
import Link from "next/link";

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div>
        <Button asChild>
          <Link href={ROUTES.LOGIN}>
            <User /> Login
          </Link>
        </Button>
      </div>
    );
  }

  const initial = session.user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="w-8 h-8 rounded-full relative ml-2 flex-center bg-gray-200"
            >
              {initial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
              <div className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Link href={ROUTES.PROFILE} className="w-full">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={ROUTES.LIST_ORDER} className="w-full">
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                className="w-full px-2 py-4 h-4 justify-start"
                variant="ghost"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default UserButton;
