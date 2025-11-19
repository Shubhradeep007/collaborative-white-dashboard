"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load initial search query only once
  const initialSearch = searchParams.get("search") || "";

  const [value, setValue] = useState(initialSearch);
  const [debouncedValue] = useDebounceValue(value, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const currentQuery = qs.parse(searchParams.toString());

    const updatedQuery = {
      ...currentQuery,
      search: debouncedValue || undefined,
    };

    // Build final URL
    const url = qs.stringifyUrl(
      {
        url: "/dashboard",
        query: updatedQuery,
      },
      { skipNull: true, skipEmptyString: true }
    );

    // Only push if the URL has changed → prevents loops
    router.push(url);
  }, [debouncedValue]);  // <--- ONLY dependency

  return (
    <div className="w-full relative">
      <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="w-full max-w-[516px] pl-9"
        placeholder="Search Boards"
        onChange={handleChange}
        value={value}
      />
    </div>
  );
};

export default SearchInput;
