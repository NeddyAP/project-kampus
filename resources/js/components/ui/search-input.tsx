import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { router } from "@inertiajs/react";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

interface SearchInputProps {
  value?: string;
  route?: string;
  params?: Record<string, string | number | boolean>;
  placeholder?: string;
}

export function SearchInput({ 
  value, 
  route, 
  params = {}, 
  placeholder = "Cari..." 
}: SearchInputProps) {
  const [search, setSearch] = useState(value || "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (route && debouncedSearch !== value) {
      router.get(
        route,
        { search: debouncedSearch, ...params },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
        }
      );
    }
  }, [debouncedSearch, route, params, value]);

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
