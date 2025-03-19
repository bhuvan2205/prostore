import { Button } from "@/components/ui/button";
import { Check, Loader } from "lucide-react";
import { useFormStatus } from "react-dom";

const PlaceOrderButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending}>
      {pending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Check className="w-4 h-4" />
      )}{" "}
      Place Order
    </Button>
  );
};

export default PlaceOrderButton;
