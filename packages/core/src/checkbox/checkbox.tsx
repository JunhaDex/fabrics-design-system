import { useId, type ComponentProps, type ReactNode } from 'react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { Check, Minus } from 'lucide'
import { tv } from 'tailwind-variants'
import { Icon } from '../icon/icon'
import { Label } from '../label/label'
import { layoutClass } from '../utils/layout-class'

export const checkbox = tv({
  slots: {
    root: 'inline-flex items-center gap-2',
    control: [
      'inline-flex size-4 shrink-0 items-center justify-center',
      'rounded-control border border-border-strong bg-field text-on-brand',
      'data-[state=checked]:border-brand data-[state=checked]:bg-brand',
      'data-[state=indeterminate]:border-brand data-[state=indeterminate]:bg-brand',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      'aria-invalid:border-danger',
      'transition-colors duration-fast ease-standard',
    ],
  },
})

export interface CheckboxProps extends Omit<
  ComponentProps<typeof CheckboxPrimitive.Root>,
  'children'
> {
  /** 체크박스 오른쪽에 붙는 레이블. Field 안에서 쓸 때는 생략한다. */
  label?: ReactNode
}

export function Checkbox({ label, className, id, checked, ...props }: CheckboxProps) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const s = checkbox()

  return (
    <div className={s.root({ class: layoutClass(className) })}>
      <CheckboxPrimitive.Root id={controlId} checked={checked} className={s.control()} {...props}>
        <CheckboxPrimitive.Indicator>
          {/* 중간 상태는 제어 컴포넌트에서만 의미가 있으므로 checked 값으로 가른다. */}
          <Icon node={checked === 'indeterminate' ? Minus : Check} size={12} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && <Label htmlFor={controlId}>{label}</Label>}
    </div>
  )
}
