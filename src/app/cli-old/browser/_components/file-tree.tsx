'use client'

import { ChevronRight } from 'lucide-react'
import { ComponentProps, createContext, useContext, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TreeContextValue {
  selected?: string
  setSelected: (value?: string) => void
}

const TreeContext = createContext<TreeContextValue>({
  setSelected: () => {}
})

interface TreeProps {
  value: string
  children?: React.ReactNode
  defaultOpen?: boolean
  onSelect?: (value: string) => void
}

export function Tree({ value, children, defaultOpen, onSelect }: TreeProps) {
  const [selected, setSelected] = useState<string>()

  return (
    <TreeContext.Provider value={{ selected, setSelected }}>
      <div className="relative overflow-hidden">
        <TreeItem
          value={value}
          onSelect={onSelect}
          defaultOpen={defaultOpen}
        >
          {children}
        </TreeItem>
      </div>
    </TreeContext.Provider>
  )
}

interface TreeItemProps {
  value: string
  element?: React.ReactNode
  children?: React.ReactNode
  defaultOpen?: boolean
  onSelect?: (value: string) => void
}

export function TreeItem({
  value,
  element,
  children,
  defaultOpen,
  onSelect
}: TreeItemProps) {
  const context = useContext(TreeContext)
  const [open, setOpen] = useState(defaultOpen)
  const selected = context.selected === value
  const hasChildren = Boolean(children)
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selected && itemRef.current) {
      itemRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [selected])

  return (
    <div>
      <div
        ref={itemRef}
        className={cn(
          'flex items-center py-2 px-2 cursor-pointer rounded-lg hover:bg-accent',
          selected && 'bg-accent'
        )}
        onClick={(e) => {
          if (hasChildren) {
            setOpen(!open)
          } else {
            context.setSelected(value)
            onSelect?.(value)
          }
          e.stopPropagation()
        }}
      >
        {hasChildren && (
          <ChevronRight
            className={cn(
              'h-4 w-4 shrink-0 transition-transform',
              open && 'rotate-90'
            )}
          />
        )}
        {!hasChildren && <div className="w-4" />}
        <div className="flex-1 pl-2 min-w-0 truncate">
          {element || value}
        </div>
      </div>
      {hasChildren && open && (
        <div className="pl-4 border-l ml-3 mt-1">{children}</div>
      )}
    </div>
  )
}

interface FolderProps extends ComponentProps<typeof TreeItem> {
  name?: string
}

export function Folder({ element, name, ...props }: FolderProps) {
  return <TreeItem element={element || name} {...props} />
}
