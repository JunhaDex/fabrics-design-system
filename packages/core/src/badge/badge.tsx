import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

/**
 * tone × appearance 24키 매트릭스. Tailwind 가 동적 클래스를 스캔하지 못하므로
 * 18개 조합을 리터럴로 적는다. 테마를 추가할 때는 같은 키의 **값만** 다시
 * 선언하면 되고 이 표는 그대로 둔다.
 */
export const badge = tv({
  slots: {
    root: 'inline-flex items-center gap-1 rounded-control font-medium whitespace-nowrap',
  },
  variants: {
    // 색은 tone 과 appearance 의 조합에서 결정되므로 여기서는 비워 둔다.
    tone: { neutral: {}, brand: {}, success: {}, warning: {}, danger: {}, info: {} },
    appearance: { solid: {}, subtle: {}, outline: { root: 'border' } },
    size: {
      sm: { root: 'px-1.5 py-0.5 text-xs' },
      md: { root: 'px-2 py-0.5 text-sm' },
    },
  },
  compoundVariants: [
    { tone: 'neutral', appearance: 'solid', class: { root: 'bg-neutral text-on-neutral' } },
    {
      tone: 'neutral',
      appearance: 'subtle',
      class: { root: 'bg-neutral-subtle text-on-neutral-subtle' },
    },
    {
      tone: 'neutral',
      appearance: 'outline',
      class: { root: 'border-neutral text-on-neutral-subtle' },
    },
    { tone: 'brand', appearance: 'solid', class: { root: 'bg-brand text-on-brand' } },
    {
      tone: 'brand',
      appearance: 'subtle',
      class: { root: 'bg-brand-subtle text-on-brand-subtle' },
    },
    {
      tone: 'brand',
      appearance: 'outline',
      class: { root: 'border-brand text-on-brand-subtle' },
    },
    { tone: 'success', appearance: 'solid', class: { root: 'bg-success text-on-success' } },
    {
      tone: 'success',
      appearance: 'subtle',
      class: { root: 'bg-success-subtle text-on-success-subtle' },
    },
    {
      tone: 'success',
      appearance: 'outline',
      class: { root: 'border-success text-on-success-subtle' },
    },
    { tone: 'warning', appearance: 'solid', class: { root: 'bg-warning text-on-warning' } },
    {
      tone: 'warning',
      appearance: 'subtle',
      class: { root: 'bg-warning-subtle text-on-warning-subtle' },
    },
    {
      tone: 'warning',
      appearance: 'outline',
      class: { root: 'border-warning text-on-warning-subtle' },
    },
    { tone: 'danger', appearance: 'solid', class: { root: 'bg-danger text-on-danger' } },
    {
      tone: 'danger',
      appearance: 'subtle',
      class: { root: 'bg-danger-subtle text-on-danger-subtle' },
    },
    {
      tone: 'danger',
      appearance: 'outline',
      class: { root: 'border-danger text-on-danger-subtle' },
    },
    { tone: 'info', appearance: 'solid', class: { root: 'bg-info text-on-info' } },
    {
      tone: 'info',
      appearance: 'subtle',
      class: { root: 'bg-info-subtle text-on-info-subtle' },
    },
    {
      tone: 'info',
      appearance: 'outline',
      class: { root: 'border-info text-on-info-subtle' },
    },
  ],
  defaultVariants: { tone: 'neutral', appearance: 'subtle', size: 'md' },
})

export interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badge> {}

/**
 * 상태·분류 라벨. 밀도(padding)는 토큰이 아니라 고정 유틸리티이며,
 * 모양은 `sem.radius.control` 을 따르므로 테마가 각진 배지로 바꿀 수 있다.
 */
export function Badge({ tone, appearance, size, className, ...props }: BadgeProps) {
  const { root } = badge({ tone, appearance, size })
  return <span className={root({ class: layoutClass(className) })} {...props} />
}
