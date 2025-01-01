import { Component } from './types'

export const COMPONENTS: Component[] = [
  { 
    name: 'accordion',
    label: 'Accordion',
    description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
    category: 'Layout'
  },
  { 
    name: 'button',
    label: 'Button',
    description: 'Displays a button or a component that looks like a button.',
    category: 'Input'
  },
  { 
    name: 'card',
    label: 'Card',
    description: 'Containers for displaying content and actions about a single subject.',
    category: 'Layout'
  },
  { 
    name: 'dialog',
    label: 'Dialog',
    description: 'A modal dialog that interrupts the user with important content.',
    category: 'Overlay'
  },
] as const

export const DEFAULT_COMPONENT_PATH = 'src/components/ui'
