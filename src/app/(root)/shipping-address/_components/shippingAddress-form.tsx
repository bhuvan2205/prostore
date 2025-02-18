"use client";

import { useToast } from "@/hooks/use-toast";
import { shippingAddressSchema } from "@/lib/validator";
import { ShippingAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/actions/user";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";

type ShippingAddressFormProps = {
  address: ShippingAddress;
};

const ShippingAddressForm = (props: ShippingAddressFormProps) => {
  const { address } = props || {};
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = (
    values
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast({
          description: res.message,
          variant: "destructive",
        });
        return;
      }

      router.push(ROUTES.PAYMENT_METHOD);
    });
  };

  return (
    <div className='mx-auto space-y-4 max-w-md'>
      <h1 className='h2-bold mt-4'>
        <p className='text-sm text-muted-foreground'>
          Please enter your shipping address.
        </p>
        <Form {...form}>
          <form
            method='post'
            className='space-y-4'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='streetAddress'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='123 Main St'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='New York'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='postalCode'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='12345'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
              <FormField
                control={form.control}
                name='country'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='United States'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex gap-2'>
              <Button
                type='submit'
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowRight className='w-4 h-4' />
                )}{" "}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </h1>
    </div>
  );
};

export default ShippingAddressForm;
