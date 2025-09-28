"use client";

import { createUpdateReview, getReviewFromUser } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_REVIEW_DEFAULT_VALUES } from "@/constants/ratings";
import { useToast } from "@/hooks/use-toast";
import { insertReviewFormSchema } from "@/lib/validator";
import { InsertReviewForm } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ReviewFormProps = {
  productId: string;
  userId: string;
  onReviewSubmit: () => void;
};

const ReviewForm = (props: ReviewFormProps) => {
  const { productId, userId, onReviewSubmit } = props;
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertReviewFormSchema>>({
    resolver: zodResolver(insertReviewFormSchema),
    defaultValues: CREATE_REVIEW_DEFAULT_VALUES,
  });

  const handleClick = async () => {
    const review = await getReviewFromUser({ productId });

    if (review) {
      form.setValue("rating", review.rating);
      form.setValue("title", review.title);
      form.setValue("description", review.description);
    }

    setOpen(true);
  };

  const onSubmit = async (formValues: InsertReviewForm) => {
    const res = await createUpdateReview({
      ...formValues,
      productId,
      userId,
    });

    if (!res.success) {
      toast({
        description: res.message,
        variant: "destructive",
      });
      return;
    }

    setOpen(false);
    onReviewSubmit();
    toast({
      description: res.message,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={handleClick}>Write a review</Button>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your thoughts with other customers
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 5 }).map((_, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {index + 1}{" "}
                              <StarIcon className="w-4 h-4 inline" />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewForm;
