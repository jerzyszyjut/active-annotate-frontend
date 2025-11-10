import { Input } from "@heroui/input";
import { SearchIcon } from "@/components/icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  return (
    <Input
      classNames={{
        base: "max-w-xs",
        mainWrapper: "h-full",
        input: "text-small",
        inputWrapper:
          "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
      }}
      placeholder={placeholder}
      size="lg"
      startContent={<SearchIcon />}
      type="search"
      value={value}
      onValueChange={onChange}
    />
  );
}
