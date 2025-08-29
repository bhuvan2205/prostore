"use client";

import { ADMIN_NAVLINKS, USER_NAVLINKS } from "@/constants/user";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HtmlHTMLAttributes } from "react";

type MainNavProps = {
  className?: string;
} & HtmlHTMLAttributes<HTMLElement>;

const MainNav = (props: MainNavProps) => {
  const { className, ...attributes } = props || {};
  const pathname = usePathname();
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...attributes}
    >
      {ADMIN_NAVLINKS.map((link) => (
        <Link
          href={link.href}
          key={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname.includes(link.href) ? "" : "text-muted-foreground"
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
