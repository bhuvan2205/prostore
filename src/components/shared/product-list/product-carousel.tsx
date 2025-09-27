"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

const ProductCarousel = ({ products }: { products: Product[] }) => {
  return (
    <>
      <Carousel
        className="w-full mb-12"
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          {products?.map((product) => (
            <CarouselItem key={product?.id}>
              <Link href={`/product/${product.slug}`}>
                <div className="relative mx-auto">
                  <Image
                    src={product.banner as string}
                    alt={product.name}
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="h-auto w-full"
                  />
                  <div className="absolute inset-0 flex items-end justify-center">
                    <h2 className="bg-gray-900 font-bold bg-opacity-50 text-2xl px-2 text-white">
                      {product?.name}
                    </h2>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};

export default ProductCarousel;
