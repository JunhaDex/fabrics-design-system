import type { ComponentProps } from 'react'
import { Toggle as TogglePrimitive } from 'radix-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const toggle = tv({
  slots: {
    root: [
      'inline-flex items-center justify-center gap-2 font-medium',
      'rounded-control px-control-x py-control-y text-on-surface',
      'hover:bg-surface-raised',
      'data-[state=on]:bg-brand data-[state=on]:text-on-brand',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      'transition-colors duration-fast ease-standard',
    ],
  },
  variants: {
    size: {
      sm: { root: 'text-sm' },
      md: { root: 'text-base' },
      lg: { root: 'text-lg' },
    },
  },
  defaultVariants: { size: 'md' },
})

export interface ToggleProps
  extends ComponentProps<typeof TogglePrimitive.Root>, VariantProps<typeof toggle> {}

export function Toggle({ size, className, ...props }: ToggleProps) {
  const { root } = toggle({ size })
  return <TogglePrimitive.Root className={root({ class: layoutClass(className) })} {...props} />
}
