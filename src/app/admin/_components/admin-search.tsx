"use client";

import { Input } from "@/components/ui/input";
import { getAdminFormActionUrl } from "@/lib/form";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AdminSearch = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formActionUrl = getAdminFormActionUrl(pathname);
  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        name="query"
        placeholder="Search..."
        className="md:w-[100px] lg:w-[300px]"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
      />
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  );
};

export default AdminSearch;
