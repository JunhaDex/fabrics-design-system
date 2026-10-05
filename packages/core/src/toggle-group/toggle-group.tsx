import type { ComponentProps, ReactNode } from 'react'
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import { toggle } from '../toggle/toggle'
import type { DistributiveOmit } from '../utils/distributive-omit'
import { layoutClass } from '../utils/layout-class'

export const toggleGroup = tv({
  slots: {
    root: 'inline-flex items-center gap-1',
  },
})

export interface ToggleGroupOption {
  value: string
  label: ReactNode
  /** 레이블이 아이콘뿐일 때 접근 가능한 이름을 준다. */
  'aria-label'?: string
  disabled?: boolean
}

export type ToggleGroupProps = DistributiveOmit<
  ComponentProps<typeof ToggleGroupPrimitive.Root>,
  'children'
> &
  VariantProps<typeof toggle> & {
    options: ToggleGroupOption[]
  }

/** 항목 스타일은 Toggle 과 같은 정의를 쓴다. */
export function ToggleGroup({ options, size, className, ...props }: ToggleGroupProps) {
  const { root } = toggleGroup()
  const item = toggle({ size }).root

  return (
    <ToggleGroupPrimitive.Root className={root({ class: layoutClass(className) })} {...props}>
      {options.map((option) => (
        <ToggleGroupPrimitive.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          aria-label={option['aria-label']}
          className={item()}
        >
          {option.label}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  )
}
