"use client";

import { Button } from "@/components/ui/button";
import { urlQuery } from "@/lib/utils";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

type PaginationProps = {
  page: number;
  totalPages: number;
  urlParams?: string;
};

const Pagination = (props: PaginationProps) => {
  const { page, totalPages, urlParams } = props || {};
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (btnType: string) => {
    const pageValue = btnType === "prev" ? page - 1 : page + 1;
    const newUrl = urlQuery({
      params: searchParams.toString(),
      key: urlParams || "page",
      value: pageValue.toString(),
    });
    router.push(newUrl);
  };

  return (
    <div className="flex gap-2 flex-between">
      <Button
        size="lg"
        variant="ghost"
        className="w-28"
        disabled={page <= 1}
        onClick={() => handleClick("prev")}
      >
        <ChevronsLeft />
        Previous
      </Button>
      <Button
        size="lg"
        variant="ghost"
        className="w-28"
        disabled={page >= totalPages}
        onClick={() => handleClick("next")}
      >
        Next
        <ChevronsRight />
      </Button>
    </div>
  );
};

export default Pagination;
