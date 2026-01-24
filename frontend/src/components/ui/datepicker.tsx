import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  setDate: (value: Date | null) => void;
  label: string;
  date?: Date;
};

export function Calendar22({ setDate, label, date }: Props) {

  const dateValue = React.useMemo(() => {
    if (!date) return undefined;
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? undefined : d;
  }, [date]);

  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(dateValue);
  const [localDate, setLocalDate] = React.useState<Date | undefined>(dateValue);

  React.useEffect(() => {
    setLocalDate(dateValue);
    setMonth(dateValue || new Date());

  }, [dateValue]);


  const handleSelect = (selected: Date | undefined) => {
    const isSame =
      selected && dateValue && selected.getTime() === dateValue.getTime();

    const newValue = isSame ? undefined : selected;
    setLocalDate(selected);
    setDate(newValue || null);
    setOpen(false);
  };

  return (
    <div className="flex flex-col">
      <Label htmlFor="date" className="text-xs text-gray-500 mb-1 font-normal px-1">
        {label}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className=" justify-between font-normal"
          >
            {localDate ? localDate.toLocaleDateString('en-CA') : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={localDate}
            captionLayout="dropdown"
            onSelect={handleSelect}

            month={month}
            onMonthChange={setMonth}
            defaultMonth={dateValue}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
