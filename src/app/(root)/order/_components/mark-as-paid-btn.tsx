"use client";

import { updateOrderToPaidCOD } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";

const MarkAsPaidButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleClick = () => {
    startTransition(async () => {
      const res = await updateOrderToPaidCOD(orderId);
      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
    });
  };
  return (
    <Button type="button" disabled={isPending} onClick={handleClick}>
      {isPending ? "Processing..." : "Mark as Paid"}
    </Button>
  );
};

export default MarkAsPaidButton;
