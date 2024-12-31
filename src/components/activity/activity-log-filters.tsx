"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ActivityCategory,
	ActivitySeverity,
} from "@/server/constants/activity-log";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const filterSchema = z.object({
	search: z.string().optional(),
	category: z.string().optional(),
	severity: z.string().optional(),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	userId: z.string().optional(),
	teamId: z.string().optional(),
	resourceType: z.string().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

interface ActivityLogFiltersProps {
	onFilter: (values: FilterValues) => void;
	users?: { id: string; name: string }[];
	teams?: { id: string; name: string }[];
	resourceTypes?: string[];
}

export function ActivityLogFilters({
	onFilter,
	users = [],
	teams = [],
	resourceTypes = [],
}: ActivityLogFiltersProps) {
	const form = useForm<FilterValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			search: "",
			category: undefined,
			severity: undefined,
			startDate: undefined,
			endDate: undefined,
			userId: undefined,
			teamId: undefined,
			resourceType: undefined,
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onFilter)}
				className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
			>
				{/* Search */}
				<FormField
					control={form.control}
					name="search"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Search</FormLabel>
							<FormControl>
								<Input placeholder="Search activities..." {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Category */}
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.entries(ActivityCategory).map(([key, value]) => (
										<SelectItem key={value} value={value}>
											{key}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>

				{/* Severity */}
				<FormField
					control={form.control}
					name="severity"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Severity</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select severity" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.entries(ActivitySeverity).map(([key, value]) => (
										<SelectItem key={value} value={value}>
											{key}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>

				{/* Date Range */}
				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="startDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Start Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={"w-full pl-3 text-left font-normal"}
											>
												{field.value ? (
													format(field.value, "PPP")
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date > new Date() ||
												(form.getValues("endDate")
													? date > form.getValues("endDate")
													: false)
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="endDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>End Date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={"w-full pl-3 text-left font-normal"}
											>
												{field.value ? (
													format(field.value, "PPP")
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date > new Date() ||
												(form.getValues("startDate")
													? date < form.getValues("startDate")
													: false)
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</FormItem>
						)}
					/>
				</div>

				{/* User */}
				<FormField
					control={form.control}
					name="userId"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>User</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={"w-full justify-between font-normal"}
										>
											{field.value
												? users.find((user) => user.id === field.value)?.name
												: "Select user"}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandInput placeholder="Search users..." />
										<CommandEmpty>No user found.</CommandEmpty>
										<CommandGroup>
											{users.map((user) => (
												<CommandItem
													key={user.id}
													value={user.id}
													onSelect={() => {
														form.setValue("userId", user.id);
													}}
												>
													<Check
														className={
															"mr-2 h-4 w-4 " +
															(user.id === field.value
																? "opacity-100"
																: "opacity-0")
														}
													/>
													{user.name}
												</CommandItem>
											))}
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
						</FormItem>
					)}
				/>

				{/* Team */}
				<FormField
					control={form.control}
					name="teamId"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Team</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={"w-full justify-between font-normal"}
										>
											{field.value
												? teams.find((team) => team.id === field.value)?.name
												: "Select team"}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandInput placeholder="Search teams..." />
										<CommandEmpty>No team found.</CommandEmpty>
										<CommandGroup>
											{teams.map((team) => (
												<CommandItem
													key={team.id}
													value={team.id}
													onSelect={() => {
														form.setValue("teamId", team.id);
													}}
												>
													<Check
														className={
															"mr-2 h-4 w-4 " +
															(team.id === field.value
																? "opacity-100"
																: "opacity-0")
														}
													/>
													{team.name}
												</CommandItem>
											))}
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
						</FormItem>
					)}
				/>

				{/* Resource Type */}
				<FormField
					control={form.control}
					name="resourceType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Resource Type</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{resourceTypes.map((type) => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>

				{/* Submit Button */}
				<Button type="submit" className="ml-auto">
					Apply Filters
				</Button>
			</form>
		</Form>
	);
}
