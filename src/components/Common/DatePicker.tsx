"use client"

import * as React from "react"
import { MdDateRange } from "react-icons/md";
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    label: string;
}

export function DatePicker({ label }: DatePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    return (
        <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-black">
                {label}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal text-[#4A4A4A99] text-xs border-[#F4F4F4] hover:bg-white hover:text-[#4A4A4A99] h-10 px-4 py-2.5"
                    >
                        {date ? date.toLocaleDateString() : "mm / dd / YYYY"}
                        <MdDateRange className="text-[#4A4A4A]" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
