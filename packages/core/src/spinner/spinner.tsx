import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const spinner = tv({
  slots: {
    root: 'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
  },
  variants: {
    size: {
      sm: { root: 'size-4' },
      md: { root: 'size-5' },
      lg: { root: 'size-6' },
    },
  },
  defaultVariants: { size: 'md' },
})

export interface SpinnerProps extends ComponentProps<'span'>, VariantProps<typeof spinner> {
  /** 스크린 리더가 읽을 상태 문구. */
  label?: string
}

/** 색은 currentColor 를 따르므로 감싼 요소의 text-* 로 정한다. */
export function Spinner({ size, label = '불러오는 중', className, ...props }: SpinnerProps) {
  const { root } = spinner({ size })
  return (
    <span
      role="status"
      aria-label={label}
      className={root({ class: layoutClass(className) })}
      {...props}
    />
  )
}
