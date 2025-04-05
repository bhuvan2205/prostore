import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="container mx-auto py-10 px-4 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader>
          <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl mt-6">Your cart is empty</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Looks like you haven&apos;t added anything to your cart yet. Browse
            our collection and find something you&apos;ll love!
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild size="lg" className="px-8">
            <Link href={ROUTES.HOME}>Start Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmptyCart;
