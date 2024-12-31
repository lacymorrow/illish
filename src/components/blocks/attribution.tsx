import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast'

const builtByVariants = cva(
  'fixed z-50 flex items-center justify-between',
  {
    variants: {
      variant: {
        banner: 'inset-x-0 bottom-0 p-4 bg-primary text-primary-foreground',
        toast: 'max-w-md w-full',
        popover: 'max-w-sm rounded-lg shadow-lg',
      },
    },
    defaultVariants: {
      variant: 'banner',
    },
  }
)

export interface BuiltByShipkitProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof builtByVariants> {
  title?: string
  description?: string
  onClose?: () => void
}

export function BuiltByShipkit({
  className,
  variant,
  title = 'Built with Shipkit',
  description = 'The ultimate Next.js starter kit for your project',
  onClose,
  ...props
}: BuiltByShipkitProps) {
  const Content = () => (
    <>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </>
  )

  if (variant === 'banner') {
    return (
      <div className={cn(builtByVariants({ variant }), className)} {...props}>
        <div className="container flex items-center justify-between">
          <Content />
        </div>
      </div>
    )
  }

  if (variant === 'toast') {
    return (
      <ToastProvider>
        <Toast className={cn(builtByVariants({ variant }), className)} {...props}>
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
          {onClose && <ToastClose />}
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )
  }

  if (variant === 'popover') {
    return (
      <Card className={cn(builtByVariants({ variant }), className)} {...props}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => window.open('https://shipkit.dev', '_blank')}
          >
            Learn More
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}

