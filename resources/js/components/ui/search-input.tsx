import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect } from "react";

interface SearchInputProps {
  value?: string;
}

export function SearchInput({ value }: SearchInputProps) {
  const { data, setData, get } = useForm({
    search: value || "",
  });

  const debouncedSearch = useDebounce(data.search, 300);

  useEffect(() => {
    if (debouncedSearch !== value) {
      get("/users", {
        preserveState: true,
        preserveScroll: true,
      });
    }
  }, [debouncedSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Cari pengguna..."
        className="pl-8"
        value={data.search}
        onChange={(e) => setData("search", e.target.value)}
      />
    </div>
  );
}
