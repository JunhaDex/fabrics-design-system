import type { ComponentProps } from 'react'
import { Progress as ProgressPrimitive } from 'radix-ui'
import { tv } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const progress = tv({
  slots: {
    root: 'relative h-1.5 w-full overflow-hidden rounded-full bg-track',
    indicator: 'size-full bg-brand transition-transform duration-base ease-standard',
  },
})

export type ProgressProps = Omit<ComponentProps<typeof ProgressPrimitive.Root>, 'children'>

export function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  const s = progress()
  const percent = value == null ? 0 : (value / max) * 100

  return (
    <ProgressPrimitive.Root
      value={value}
      max={max}
      className={s.root({ class: layoutClass(className) })}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={s.indicator()}
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
