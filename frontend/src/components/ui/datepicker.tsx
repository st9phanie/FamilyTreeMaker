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
  setDate: (value: Date | undefined) => void;
  label: string;
  existingDate?: Date;
}

export function Calendar22({ setDate, label, existingDate }: Props) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate2] = React.useState<Date | undefined>(existingDate)

  React.useEffect(() => {
    setDate2(existingDate)
  }, [existingDate])

  const handleSelect = (currentValue: Date) => {
    const newValue = currentValue === date ? undefined : currentValue
    setDate2(newValue)
    setDate(newValue)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1 font-normal">
        {label}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-[250px] justify-between font-normal"
          >
            {date ? date.toLocaleString("en-ca").substring(0,10) : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              handleSelect(date!)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
