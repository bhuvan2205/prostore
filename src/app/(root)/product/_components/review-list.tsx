"use client";

import { ROUTES } from "@/constants/routes";
import { Review } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReviewForm from "./review-form";
import { getAllReviews } from "@/actions/reviews";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Ratings from "@/components/shared/product-list/ratings";

type ReviewListProps = {
  userId?: string;
  productId: string;
  productSlug: string;
};

const ReviewList = (props: ReviewListProps) => {
  const { userId, productId, productSlug } = props || {};

  const [reviews, setReviews] = useState<Review[]>([]);

  const reloadReviews = async () => {
    const res = await getAllReviews({ productId });
    setReviews(res.data);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await getAllReviews({ productId });
      setReviews(res.data);
    };
    fetchReviews();
  }, []);

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <ReviewForm
          productId={productId}
          userId={userId}
          onReviewSubmit={reloadReviews}
        />
      ) : (
        <div>
          Please
          <Link
            href={`${ROUTES.LOGIN}?callbackUrl=/product/${productSlug}`}
            className="px-1 text-blue-700"
          >
            sign-in
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Ratings value={review.rating} />
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  {review.user ? review.user.name : "User"}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDateTime(review.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
