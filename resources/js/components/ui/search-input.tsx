import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { router } from "@inertiajs/react";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

interface SearchInputProps {
  value?: string;
}

export function SearchInput({ value }: SearchInputProps) {
  const [search, setSearch] = useState(value || "");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch !== value) {
      router.get(
        "/users",
        { search: debouncedSearch },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
        }
      );
    }
  }, [debouncedSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Cari pengguna..."
        className="pl-8"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
