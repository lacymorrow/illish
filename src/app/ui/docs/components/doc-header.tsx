import { type RegistryItem } from "../../registry/schema"

interface DocHeaderProps {
    item: RegistryItem
}

export function DocHeader({ item }: DocHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
                {item.description && (
                    <p className="text-lg text-muted-foreground">{item.description}</p>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {item.categories?.map((category) => (
                    <span
                        key={category}
                        className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-sm font-medium"
                    >
                        {category}
                    </span>
                ))}
            </div>
        </div>
    )
}
