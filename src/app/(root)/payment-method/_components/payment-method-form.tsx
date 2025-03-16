"use client";

import { updateUserPaymentMethod } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DEFAULT_PAYMENT_OPTION, PAYMENT_METHODS } from "@/constants/payments";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import { paymentMethodSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PaymentMethodFormProps = {
  preferredPaymentMethod: string | null;
};

const PaymentMethodForm = (props: PaymentMethodFormProps) => {
  const { preferredPaymentMethod } = props || {};
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_OPTION,
    },
  });

  const onSubmit = async (formData: z.infer<typeof paymentMethodSchema>) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(formData);

      if (!res.success) {
        toast({
          description: res.message,
          variant: "destructive",
        });
        return;
      }

      router.push(ROUTES.PLACE_ORDER);
    });
  };

  return (
    <div className="mx-auto space-y-4 max-w-md">
      <h1 className="h2-bold mt-4">Payment Method</h1>
      <p className="text-sm text-muted-foreground">
        Pleass select a payment method.
      </p>
      <Form {...form}>
        <form
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {PAYMENT_METHODS?.map((paymentMethod) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={paymentMethod}
                        >
                          <FormControl>
                            <RadioGroupItem value={paymentMethod} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {paymentMethod}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentMethodForm;
