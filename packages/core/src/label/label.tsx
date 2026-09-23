import type { ComponentProps } from 'react'
import { Label as LabelPrimitive } from 'radix-ui'
import { tv } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const label = tv({
  slots: {
    root: 'text-sm font-medium text-on-surface',
  },
})

export type LabelProps = ComponentProps<typeof LabelPrimitive.Root>

/** 네이티브가 아닌 컨트롤에서도 클릭이 전달되도록 Radix Label 을 쓴다. */
export function Label({ className, ...props }: LabelProps) {
  const { root } = label()
  return <LabelPrimitive.Root className={root({ class: layoutClass(className) })} {...props} />
}
