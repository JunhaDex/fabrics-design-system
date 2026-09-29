import type { ComponentProps } from 'react'
import { Separator as SeparatorPrimitive } from 'radix-ui'
import { tv } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const separator = tv({
  slots: {
    root: 'shrink-0 bg-border',
  },
  variants: {
    orientation: {
      horizontal: { root: 'h-px w-full' },
      vertical: { root: 'h-full w-px' },
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

/** `orientation` 은 Radix prop 이자 variant 키다. `VariantProps` 를 함께 상속하면 충돌한다. */
export type SeparatorProps = ComponentProps<typeof SeparatorPrimitive.Root>

/**
 * 구분선. `decorative` 를 주면 `role="none"` 이 되어 스크린 리더가 건너뛴다.
 * 세로 구분선은 부모 높이를 따르므로 감싼 요소에 높이가 있어야 보인다.
 * 간격은 `className` 의 margin 으로 정한다.
 */
export function Separator({ orientation = 'horizontal', className, ...props }: SeparatorProps) {
  const { root } = separator({ orientation })
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      className={root({ class: layoutClass(className) })}
      {...props}
    />
  )
}
