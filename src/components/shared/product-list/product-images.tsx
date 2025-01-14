"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type ProductImagesProps = {
  images: string[];
};

const ProductImages = (props: ProductImagesProps) => {
  const { images } = props || {};
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        src={images[current]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              "border mr-2 cursor-pointer hover:border-orange-600",
              {
                "border-orange-500": current === index,
              }
            )}
          >
            <Image src={image} width={100} height={100} alt={image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
