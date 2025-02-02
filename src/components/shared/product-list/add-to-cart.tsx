"use client";

import { addItemToCart, removeItemFromCart } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { Cart, LineItem } from "@/types";
import { Loader, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type AddToCartProps = {
  cart?: Cart;
  lineItem: LineItem;
};

const AddToCart = (props: AddToCartProps) => {
  const { lineItem, cart } = props || {};
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const existingItem =
    cart &&
    cart?.lineItems.find((item) => item.productId === lineItem.productId);

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(lineItem);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }

      toast({
        description: res.message,
        action: (
          <ToastAction
            altText="Go To Cart"
            className="bg-primary text-white hover:bg-gray-800"
            onClick={() => router.push(ROUTES.CART)}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(lineItem.productId);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }

      toast({
        description: res.message,
        action: (
          <ToastAction
            altText="Go To Cart"
            className="bg-primary text-white hover:bg-gray-800"
            onClick={() => router.push(ROUTES.CART)}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });
  };

  return (
    <>
      {existingItem ? (
        <div>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleRemoveFromCart}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-2">{existingItem.quantity}</span>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleAddToCart}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          className="w-full"
          disabled={isPending}
          onClick={handleAddToCart}
        >
          {isPending ? (
            <Loader className="animate-spin w-4 h-4" />
          ) : (
            "Add to Cart"
          )}
        </Button>
      )}
    </>
  );
};

export default AddToCart;
