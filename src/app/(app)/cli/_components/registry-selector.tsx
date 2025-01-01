'use client'

import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

const PREDEFINED_REGISTRIES = [
	{
		value: 'https://registry.bones.sh',
		label: 'Official Bones UI',
	},
	{
		value: 'https://shadcn.bones.sh',
		label: 'Shadcn UI',
	},
]

interface RegistrySelectorProps {
	value: string
	onChange: (value: string) => void
}

export function RegistrySelector({ value, onChange }: RegistrySelectorProps) {
	const [open, setOpen] = React.useState(false)
	const [customUrl, setCustomUrl] = React.useState('')

	const selectedRegistry = PREDEFINED_REGISTRIES.find(r => r.value === value)

	React.useEffect(() => {
		// If value is not in predefined registries, it must be a custom URL
		if (value && !selectedRegistry) {
			setCustomUrl(value)
		}
	}, [value, selectedRegistry])

	return (
		<div className="flex gap-2">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[200px] justify-between"
					>
						{selectedRegistry?.label || 'Select registry...'}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Search registries..." className="h-9" />
						<CommandList>
							<CommandEmpty>No registry found.</CommandEmpty>
							<CommandGroup>
								{PREDEFINED_REGISTRIES.map((registry) => (
									<CommandItem
										key={registry.value}
										value={registry.value}
										onSelect={(currentValue) => {
											onChange(currentValue === value ? '' : currentValue)
											setOpen(false)
										}}
									>
										{registry.label}
										<Check
											className={cn(
												'ml-auto h-4 w-4',
												value === registry.value ? 'opacity-100' : 'opacity-0'
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			<div className="flex-1">
				<Input
					placeholder="Or enter registry URL..."
					value={customUrl}
					onChange={(e) => {
						setCustomUrl(e.target.value)
						onChange(e.target.value)
					}}
				/>
			</div>
		</div>
	)
}
