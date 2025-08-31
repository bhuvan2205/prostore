"use client";

import { deliverOrder } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";

const MarkAsDeliveredButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleClick = () => {
    startTransition(async () => {
      const res = await deliverOrder(orderId);
      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
    });
  };
  return (
    <Button type="button" disabled={isPending} onClick={handleClick}>
      {isPending ? "Processing..." : "Mark as Delivered"}
    </Button>
  );
};

export default MarkAsDeliveredButton;
