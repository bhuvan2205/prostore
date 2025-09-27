import { getAllCategories } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

const SearchProduct = async () => {
  const categories = await getAllCategories();

  return (
    <>
      <form action="/search" method="GET">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Select name="category">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.category} value={category.category}>
                  {category.category} ({category._count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="query"
            type="text"
            className="md:w-[100px] lg:w-[300px] p-[19px]"
            placeholder="Search products"
          />
          <Button className="p-[19px]"><SearchIcon /></Button>
        </div>
      </form>
    </>
  );
};

export default SearchProduct;
