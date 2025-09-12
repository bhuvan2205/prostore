"use client";

import { createProduct, updateProduct } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_PRODUCT_DEFAULT_VALUES } from "@/constants/products";
import { useToast } from "@/hooks/use-toast";
import { insertProductSchema } from "@/lib/validator";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, useForm } from "react-hook-form";
import slugify from "slugify";
import { z } from "zod";
import { ROUTES } from "@/constants/routes";
import { Card, CardContent } from "@/components/ui/card";
import { UploadButton } from "@/lib/upload-thing";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

type ProductFormProps = {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
};

const ProductForm = ({ type, product, productId }: ProductFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues:
      product && type === "Update" ? product : CREATE_PRODUCT_DEFAULT_VALUES,
  });

  const onSubmit = async (formData: z.infer<typeof insertProductSchema>) => {
    console.log("formData", formData);
    if (type === "Create") {
      const res = await createProduct(formData);
      if (!res.success) {
        toast({
          description: res.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        description: res.message,
      });
    } else {
      const res = await updateProduct({ ...formData, id: productId as string });
      if (!res.success) {
        toast({
          description: res.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        description: res.message,
      });
    }
    router.push(ROUTES.ADMIN_PRODUCTS);
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <>
      <Form {...form}>
        <form
          method="POST"
          className="space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="name"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "name"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "slug"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Enter slug" {...field} />
                      <Button
                        type="button"
                        variant="secondary"
                        className="mt-2"
                        onClick={() => {
                          form.setValue(
                            "slug",
                            slugify(form.getValues("name"), { lower: true })
                          );
                        }}
                      >
                        Generate
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="category"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "category"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "brand"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <FormField
              control={form.control}
              name="stock"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "stock"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product stock" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "price"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-5 upload-field md:flex-row">
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel>Images</FormLabel>
                  <Card>
                    <CardContent className="space-y-2 mt-2 min-h-48">
                      <div className="flex-start space-x-2">
                        {images.map((image: string) => (
                          <Image
                            key={image}
                            src={image}
                            alt="product image"
                            className="w-20 h-20 object-cover object-center rounded-sm"
                            width={100}
                            height={100}
                          />
                        ))}
                        <UploadButton
                          disabled
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue("images", [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="upload-field">
            Featured Product
            <Card>
              <CardContent className="space-y-2 mt-2">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="space-x-2 items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Is Featured?</FormLabel>
                    </FormItem>
                  )}
                />
                {isFeatured && banner && (
                  <Image
                    alt="product image"
                    className="w-full object-cover object-center rounded-sm"
                    src={banner}
                    width={1920}
                    height={680}
                  />
                )}
                {isFeatured && !banner && (
                  <UploadButton
                    disabled
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      form.setValue("banner", res[0].url);
                    }}
                    onUploadError={(error: Error) => {
                      toast({
                        variant: "destructive",
                        description: `ERROR! ${error.message}`,
                      });
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
          <div>
            <FormField
              control={form.control}
              name="description"
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "description"
                >;
              }) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              size="lg"
            >
              {form.formState.isSubmitting
                ? "Submitting..."
                : `${type} product`}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
