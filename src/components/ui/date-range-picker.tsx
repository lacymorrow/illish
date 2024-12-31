"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { DateRange } from "react-day-picker";

export function DatePickerWithRange({
	className,
}: React.HTMLAttributes<HTMLDivElement>) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [date, setDate] = React.useState<DateRange | undefined>(() => {
		const startDate = searchParams?.get("startDate");
		const endDate = searchParams?.get("endDate");
		if (startDate && endDate) {
			return {
				from: new Date(startDate),
				to: new Date(endDate),
			};
		}
		const today = new Date();
		return {
			from: addDays(today, -30),
			to: today,
		};
	});

	const handleSelect = (range: DateRange | undefined) => {
		setDate(range);
		if (!range) return;

		const newSearchParams = new URLSearchParams(searchParams?.toString());
		if (range.from) {
			newSearchParams.set("startDate", range.from.toISOString());
		} else {
			newSearchParams.delete("startDate");
		}
		if (range.to) {
			newSearchParams.set("endDate", range.to.toISOString());
		} else {
			newSearchParams.delete("endDate");
		}
		router.push(`${pathname}?${newSearchParams.toString()}`);
	};

	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant="outline"
						className={cn(
							"w-[300px] justify-start text-left font-normal",
							!date && "text-muted-foreground",
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
							<span>Pick a date range</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={handleSelect}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
