"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFormProps {
  searchAction: (formData: FormData) => void;
}

export function SearchForm({ searchAction }: Readonly<SearchFormProps>) {
  return (
    <div className="flex  px-3 md:px-0 py-5 items-center flex-col align-center justify-center gap-5">
      <form action={searchAction} className="flex flex-row max-w-3xl w-full">
        <div className="bg-white rounded-xl grow">
          <Input
            name="query"
            className="p-7"
            placeholder="I'm searching for..."
          />
        </div>
        <button 
          type="submit"
          className="bg-black flex items-center justify-center rounded-xl px-4 m-1 hover:cursor-pointer hover:bg-gray-800 transition-colors"
        >
          <Search className="text-white" />
        </button>
      </form>
    </div>
  );
}