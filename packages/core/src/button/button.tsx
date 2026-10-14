import type { ComponentProps } from 'react'
import { Slot } from 'radix-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

/** 면이 있는 컨트롤의 그림자와 누름 상태. 테마가 슬롯으로 채운다(neutral 은 없음). */
export const pressable =
  'shadow-control active:translate-x-press active:translate-y-press active:shadow-control-pressed'

export const button = tv({
  slots: {
    root: [
      'inline-flex items-center justify-center gap-2 font-medium',
      'rounded-control px-control-x py-control-y',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
    ],
  },
  variants: {
    variant: {
      primary: { root: ['bg-brand text-on-brand hover:bg-brand-hover', pressable] },
      secondary: {
        root: [
          'border border-border bg-surface-raised text-on-surface hover:border-border-strong',
          pressable,
        ],
      },
      danger: { root: ['bg-danger text-on-danger', pressable] },
      ghost: { root: 'text-on-surface hover:bg-surface-raised' },
    },
    size: {
      sm: { root: 'text-sm' },
      md: { root: 'text-base' },
      lg: { root: 'text-lg' },
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof button> {
  /** 자식 요소를 버튼 스타일의 루트로 렌더링한다 (Radix Slot). */
  asChild?: boolean
}

export function Button({ asChild, variant, size, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  const { root } = button({ variant, size })
  return <Comp className={root({ class: layoutClass(className) })} {...props} />
}
