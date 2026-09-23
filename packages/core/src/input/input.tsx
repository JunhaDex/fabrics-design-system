import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const input = tv({
  slots: {
    root: [
      'w-full rounded-control border border-border bg-field text-on-surface',
      'px-control-x py-control-y',
      'placeholder:text-on-surface-muted',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      // 오류 상태는 별도 prop 이 아니라 aria-invalid 하나를 근거로 삼는다.
      'aria-invalid:border-danger aria-invalid:focus-visible:ring-danger',
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

/** 네이티브 `size` 속성(문자 수)과 이름이 겹치므로 제외하고 변형으로 다시 정의한다. */
export interface InputProps
  extends Omit<ComponentProps<'input'>, 'size'>, VariantProps<typeof input> {}

export function Input({ size, className, ...props }: InputProps) {
  const { root } = input({ size })
  return <input className={root({ class: layoutClass(className) })} {...props} />
}
