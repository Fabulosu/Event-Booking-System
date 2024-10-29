"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
    className?: string;
    onChange?: (date: DateRange | undefined) => void;
}

interface DatePickerDemoProps {
    className?: string;
    onChange?: (date: Date | undefined) => void;
    defaultValue?: Date;
}

export function DatePickerDemo({ className, onChange, defaultValue }: DatePickerDemoProps) {
    const [date, setDate] = React.useState<Date | undefined>(defaultValue);

    const handleDateChange = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (onChange) {
            onChange(selectedDate); // Call the onChange prop with the new date
        }
    };

    return (
        <div className={className}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange} // Call handleDateChange when a date is selected
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

export function DatePickerWithRange({
    className,
    onChange,
}: DatePickerWithRangeProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 20),
    });

    const handleDateChange = (selectedDate: DateRange | undefined) => {
        setDate(selectedDate);
        if (onChange) {
            onChange(selectedDate);
        }
    };

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}