import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// -------------------- Types --------------------
export type ComboItem = {
  id: number;
  label: string;
};

type Props = {
  list: ComboItem[];
  listType: string;
  setValue: (id: number | null) => void;
  value?: number | null; 
  disabled?: boolean;
};

// -------------------- Component --------------------
const Combobox = ({
  list,
  listType,
  setValue,
  value,
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<number | null>(null);

  // controlled vs uncontrolled
  const actualValue = value ?? internalValue;

  const selectedItem = list.find(item => item.id === actualValue);

  const handleSelect = (id: number) => {
    const newValue = id === actualValue ? null : id;

    if (value === undefined) {
      setInternalValue(newValue);
    }

    setValue(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-[250px] justify-between"
        >
          {selectedItem ? selectedItem.label : `Select ${listType}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${listType}...`}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No {listType.toLowerCase()} found.</CommandEmpty>

            <CommandGroup>
              {list.map(item => (
                <CommandItem
                  key={item.id}
                  value={item.label}
                  onSelect={() => handleSelect(item.id)}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      item.id === actualValue ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
