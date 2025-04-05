import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

export default function EmptyOrders() {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center p-4">
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl mt-6">No orders yet</CardTitle>
          <CardDescription>
            You haven&apos;t placed any orders yet. Start shopping to see your
            orders here.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">
            Browse our collection and find something you&apos;ll love. Your
            order history will appear here once you make a purchase.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={ROUTES.HOME}>Browse Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
